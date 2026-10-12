import {
  Fragment, useEffect, useMemo, useRef, useState, useSyncExternalStore,
  type ChangeEvent, type FocusEvent, type KeyboardEvent,
} from 'react'
import clsx from 'clsx'
import {
  Button, IconCheckOutlineRegular, IconChevronDownOutlineRegular, IconChevronLeftOutlineRegular,
  IconChevronRightOutlineRegular, IconChevronUpOutlineRegular, IconCloseOutlineRegular,
  IconEditOutlineRegular, MarkdownText,
} from '@deepseek-ai/dsh-client-ui-primitives'
import type {
  QuestionNoteAnswer, QuestionNoteCarrier, QuestionNoteItem,
} from './carrier.ts'
import type { QuestionNoteDraftAnswer, QuestionNoteDraftState, QuestionNoteDraftActions } from './draft-store.ts'
import type { QuestionNoteKey } from './locales.ts'
import css from './composer.module.css'

/**
 * Enhanced question composer: a faithful fork of the official QuestionComposer
 * generic flow with one added feature — selecting an option reveals a note
 * input directly under that option, and the note travels to the model in the
 * answer's `custom` field alongside the `selected` option labels. Plan-review
 * requests are declined by the chain selector and never reach this component.
 */

/** Displayed feedback: dictionary keys translate at render; wire messages pass verbatim. */
type Feedback = { key: 'error.incomplete' | 'error.unanswered' | 'error.unavailable' | 'error.resubmit' | 'status.sent' } | { text: string }

/** A removed card can remain mounted until the composer seat updates. */
const REMOVED_CARD = {
  state: 'open', waitState: 'counting', countdown: undefined, channel: 'none', closed: true,
} as const

/**
 * Split the conventional recommendation suffix without changing the answer value.
 * @param label - Original option label returned if selected.
 * @returns Display label plus recommendation state.
 */
function parseRecommendedLabel(label: string): { label: string; recommended: boolean } {
  const suffix = /\s*(?:\((?:recommended|推荐)\)|（(?:recommended|推荐)）)\s*$/i
  return suffix.test(label)
    ? { label: label.replace(suffix, ''), recommended: true }
    : { label, recommended: false }
}

/** Only a marked first choice is an implicit draft; the user still submits it. */
function recommendedFirstOption(question: QuestionNoteItem): string | undefined {
  const label = question.options?.[0]?.label
  return label !== undefined && parseRecommendedLabel(label).recommended ? label : undefined
}

/** Accept persisted progress only when it still describes this question batch. */
function isQuestionDraftProgress(value: unknown, questionCount: number): value is QuestionNoteDraftProgressShape {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false
  const progress = value as Record<string, unknown>
  if (typeof progress.index !== 'number' || !Number.isInteger(progress.index)
    || progress.index < 0 || progress.index >= questionCount
    || !Array.isArray(progress.drafts) || progress.drafts.length !== questionCount
    || (progress.wait !== undefined && progress.wait !== 'editing' && progress.wait !== 'waiting')) return false
  return progress.drafts.every((item: unknown) => {
    if (typeof item !== 'object' || item === null || Array.isArray(item)) return false
    const draft = item as Record<string, unknown>
    return Array.isArray(draft.selected) && draft.selected.every((label: unknown) => typeof label === 'string')
      && typeof draft.custom === 'string' && typeof draft.skipped === 'boolean'
      // The per-option note map: absent on drafts persisted before it existed.
      && (draft.notes === undefined || (typeof draft.notes === 'object' && draft.notes !== null && !Array.isArray(draft.notes)
        && Object.values(draft.notes as Record<string, unknown>).every(note => typeof note === 'string')))
  })
}

/** Persisted progress shape read from the store. */
interface QuestionNoteDraftProgressShape {
  index: number
  drafts: QuestionNoteDraftAnswer[]
  wait?: 'editing' | 'waiting'
}

/** Return whether a text-field key event belongs to an active IME composition. */
function isComposing(event: KeyboardEvent<HTMLTextAreaElement>): boolean {
  // keyCode 229 is the legacy IME-composition signal engines emit without isComposing.
  return event.nativeEvent.isComposing || Reflect.get(event.nativeEvent, 'keyCode') === 229
}

/** The free-text field: the optionless question's framed block or a row's inline column. */
interface AnswerFieldProps {
  /** Visual variant: a row's inline column or the optionless question's framed block. */
  variant: 'inline' | 'block'
  /** Current draft text. */
  value: string
  /** Empty-field prompt. */
  placeholder: string
  /** Whether a submission in flight has frozen the field. */
  disabled: boolean
  /** Whether this field takes focus on mount. */
  autoFocus?: boolean
  /** Called when the field takes focus. */
  onFocus?: () => void
  /** Called with each edit of the draft. */
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void
  /** Called with each key press, before the browser's own handling. */
  onKeyDown: (event: KeyboardEvent<HTMLTextAreaElement>) => void
}

/**
 * Auto-growing free-text field: a textarea over a hidden mirror that owns the
 * height (same mechanism as the official composer; mirror and textarea MUST
 * share font, line-height, padding and wrapping rules).
 *
 * @param props - visual variant, draft text, and the field's event handlers.
 * @returns The mirrored auto-growing field.
 */
function AnswerField(props: AnswerFieldProps) {
  return (
    <div className={clsx(css.field, props.variant === 'inline' ? css.customInline : css.customBlock)}>
      <div aria-hidden className={css.fieldMirror}>{`${props.value}\n`}</div>
      <textarea
        autoFocus={props.autoFocus}
        className={css.fieldInput}
        value={props.value}
        disabled={props.disabled}
        rows={1}
        placeholder={props.placeholder}
        onFocus={props.onFocus}
        onChange={props.onChange}
        onKeyDown={props.onKeyDown}
      />
    </div>
  )
}

/** Locale lookup the renderer passes to the component. */
type QuestionNoteT = (key: QuestionNoteKey, vars?: Record<string, string | number>) => string

/** Component props assembled by the Slot renderer for this registration. */
export interface QuestionNoteComposerProps {
  /** The chain-selected pending-question carrier. */
  matched: QuestionNoteCarrier
  /** Localized copy lookup bound to this plugin's dictionary namespace. */
  t: QuestionNoteT
  /** Selector hook over this registration's declared draft store. */
  useStore: <T,>(selector: (state: QuestionNoteDraftState) => T) => T
  /** The declared store's complete mutation API. */
  actions: QuestionNoteDraftActions
}

/**
 * The enhanced question flow. Renders the carrier's current question and its
 * draft, reveals the supplement note under the selected option, and submits
 * `{ selected, custom }` together through the carrier's channel.
 * @param props - the chain-matched carrier plus the framework standard kit.
 * @returns The enhanced question card.
 */
export function QuestionNoteComposer(props: QuestionNoteComposerProps) {
  return <QuestionNoteFlow key={props.matched.key} pending={props.matched} t={props.t} useStore={props.useStore} actions={props.actions} />
}

type QuestionNoteFlowProps = Omit<QuestionNoteComposerProps, 'matched'> & { pending: QuestionNoteCarrier }

function QuestionNoteFlow({ pending, t, useStore, actions }: QuestionNoteFlowProps) {
  const questions = pending.questions
  // A read-only card built from a settled call's transcript: the same panel
  // over the recorded answers, with nothing left to submit.
  const review = pending.review
  const markdownLabels = useMemo(() => ({
    code: { copyLabel: t('copy'), copiedLabel: t('copied'), toolbarLabels: { codeLabel: t('codeBlock.title'), wrapLabel: t('codeBlock.wrap'), unwrapLabel: t('codeBlock.unwrap') } },
    footnotes: t('markdown.footnotes'),
  }), [t])
  const initialDrafts = useMemo<QuestionNoteDraftAnswer[]>(() => {
    // Recorded answers echo the question ids rather than their order.
    const recorded = new Map((review ?? []).map(answer => [answer.id, answer]))
    return questions.map((item) => {
      const answer = recorded.get(item.id)
      const custom = answer?.custom ?? ''
      const recommended = review === undefined ? recommendedFirstOption(item) : undefined
      return {
        selected: answer === undefined && recommended !== undefined ? [recommended] : [...answer?.selected ?? []],
        notes: {},
        custom,
        // A recorded answer with no selection and no custom text was skipped.
        skipped: answer !== undefined && answer.selected.length === 0 && custom === '',
      }
    })
  }, [questions, review])
  const stored = useStore(state => state.progressByRequest[pending.key])
  const validStored = isQuestionDraftProgress(stored, questions.length) ? stored : undefined
  // A review card renders the record itself, so a draft its live card left
  // behind can never surface as an answer; only the page position is restored.
  const storedProgress = review === undefined ? validStored : undefined
  const index = validStored?.index ?? 0
  const drafts = (storedProgress?.drafts ?? initialDrafts)
    .map(item => ({ ...item, notes: item.notes ?? {} }))
  const restoredWait = storedProgress?.wait
    ?? (storedProgress?.drafts.some((item, itemIndex) =>
      item.selected.length !== initialDrafts[itemIndex]?.selected.length
      || item.selected.some((label, labelIndex) => label !== initialDrafts[itemIndex]?.selected[labelIndex])
      || Object.values(item.notes ?? {}).some(note => note !== '') || item.custom !== '' || item.skipped) === true
      ? 'editing' : undefined)
  const [busy, setBusy] = useState<'answer' | 'cancel' | null>(null)
  const [error, setError] = useState<Feedback | null>(null)
  // The carrier owns the card lifecycle; subscribe directly (same data the
  // official keyed hook exposes, read through the carrier we already hold).
  const card = useSyncExternalStore(pending.subscribe, pending.snapshot) ?? REMOVED_CARD
  const canSubmit = card.channel !== 'none'
  // The answer surface freezes while a submission is in flight, and for good on
  // a review card: its call has already settled.
  const locked = busy !== null || review !== undefined
  // A waterfall submission is only "sent": the gateway drops an outcome that
  // arrives after another Client settled the event, without telling anyone.
  // The draft therefore survives until the projection closes the card, and a
  // card that flips to continued while a submission is in flight re-arms the
  // controls so the same draft can go through the Remote path.
  const sentVia = useRef<'waterfall' | null>(null)
  useEffect(() => {
    if (sentVia.current !== 'waterfall' || card.state !== 'continued') return
    sentVia.current = null
    setBusy(null)
    setError({ key: 'error.resubmit' })
  }, [card.state])
  useEffect(() => {
    if (card.closed) actions.clear(pending.key)
  }, [actions, card.closed, pending.key])
  useEffect(() => {
    actions.prune(pending.liveKeys())
  }, [pending])
  const waitDisposition = useRef<'editing' | 'waiting' | undefined>(restoredWait)
  useEffect(() => {
    if (waitDisposition.current === 'waiting') pending.takeTime()
    if (waitDisposition.current === 'editing') pending.engage()
  }, [pending])
  // The countdown belongs to the carrier, not to this component: the user can
  // close the panel and reopen it from the tool call row.
  const countdown = card.countdown
  // Collapsed to the header strip so the conversation above stays readable
  // while the user decides; answer drafts live in the Session store above.
  const [minimized, setMinimized] = useState(false)
  // The free-form textarea autofocuses on first presentation; re-expanding a
  // collapsed question must not steal focus from the expand toggle back into
  // the input, so focus is granted once per question index.
  const focusedQuestions = useRef(new Set<number>())
  const answerSurface = useRef<HTMLDivElement>(null)
  // Every navigation write stays in bounds and drafts mirrors questions 1:1.
  // oxlint-disable-next-line typescript/no-non-null-assertion
  const question = questions[index]!
  // oxlint-disable-next-line typescript/no-non-null-assertion
  const draft = drafts[index]!
  const hasOptions = (question.options?.length ?? 0) > 0
  const isLastQuestion = index === questions.length - 1

  const replaceProgress = (nextIndex: number, nextDrafts: QuestionNoteDraftAnswer[]): void => {
    actions.replace(pending.key, {
      index: nextIndex,
      drafts: nextDrafts,
      ...(waitDisposition.current === undefined ? {} : { wait: waitDisposition.current }),
    })
  }

  const takeTime = (): void => {
    waitDisposition.current = 'waiting'
    pending.takeTime()
    replaceProgress(index, drafts)
  }

  const engage = (): void => {
    if (waitDisposition.current !== undefined) return
    waitDisposition.current = 'editing'
    pending.engage()
  }

  const focusAnswerSurface = (event: FocusEvent<HTMLDivElement>): void => {
    if (!event.currentTarget.contains(event.relatedTarget)) pending.holdFocus()
  }

  const blurAnswerSurface = (event: FocusEvent<HTMLDivElement>): void => {
    if (!event.currentTarget.contains(event.relatedTarget)) pending.releaseFocus()
  }

  useEffect(() => {
    const release = (): void => { pending.releaseFocus() }
    const refocus = (): void => {
      if (waitDisposition.current === 'editing') {
        pending.engage()
        return
      }
      if (answerSurface.current?.contains(document.activeElement) === true) pending.holdFocus()
    }
    const visibilityChanged = (): void => { if (document.hidden) release(); else refocus() }
    window.addEventListener('blur', release)
    window.addEventListener('focus', refocus)
    document.addEventListener('visibilitychange', visibilityChanged)
    return () => {
      release()
      window.removeEventListener('blur', release)
      window.removeEventListener('focus', refocus)
      document.removeEventListener('visibilitychange', visibilityChanged)
    }
  }, [pending])

  const dismissFlow = (): void => {
    // A tool-call-keyed panel only leaves the seat; nothing is sent and nothing
    // is persisted, and the tool call row brings it back.
    if (pending.dismissal === 'hide') {
      void pending.dismiss()
      return
    }
    if (!canSubmit) {
      setError({ key: 'error.unavailable' })
      return
    }
    setBusy('cancel')
    setError(null)
    sentVia.current = 'waterfall'
    void pending.dismiss()
      .catch((cause: unknown) => {
        sentVia.current = null
        setBusy(null)
        setError({ text: cause instanceof Error ? cause.message : String(cause) })
      })
  }

  const updateDraft = (
    update: (current: QuestionNoteDraftAnswer) => QuestionNoteDraftAnswer,
    nextIndex = index,
  ): void => {
    engage()
    const nextDrafts = drafts.map((item, itemIndex) => itemIndex === index ? update(item) : item)
    replaceProgress(nextIndex, nextDrafts)
    setError(null)
  }

  const choose = (label: string): void => {
    updateDraft((current) => {
      if (question.multiSelect === true) {
        const selected = current.selected.includes(label)
          ? current.selected.filter(item => item !== label)
          : [...current.selected, label]
        return { ...current, selected, skipped: false }
      }
      // Enhancement: selecting stays on this question so the supplement note
      // input under the option can be filled in. The note is kept; the
      // official bottom-row text is cleared exactly like the original
      // composer, which treats it as an answer instead of the choice.
      return { selected: [label], custom: '', skipped: false }
    })
  }

  const answered = (item: QuestionNoteDraftAnswer): boolean =>
    item.selected.length > 0 || item.custom.trim() !== ''

  const completed = (item: QuestionNoteDraftAnswer): boolean => answered(item) || item.skipped

  const submitDrafts = (values: QuestionNoteDraftAnswer[]): void => {
    const missing = values.findIndex(item => !completed(item))
    if (missing >= 0) {
      replaceProgress(missing, values)
      setError({ key: 'error.incomplete' })
      return
    }
    if (!canSubmit) {
      setError({ key: 'error.unavailable' })
      return
    }
    // Enhancement: the selection travels with the per-option notes. `custom`
    // carries them — a single-select note plain, a multi-select note labelled
    // `option: note` per line so the model can attribute each note to its
    // option — and a bottom-row answer joins last. A single-select whose
    // selection the bottom row cleared still submits custom-only, exactly
    // like the official composer.
    const answer: QuestionNoteAnswer = {
      answers: questions.map((item, itemIndex) => {
        const value = values[itemIndex] as QuestionNoteDraftAnswer
        if (value.skipped) return { id: item.id, selected: [] }
        const custom = value.custom.trim()
        const parts: string[] = []
        if (item.multiSelect === true) {
          for (const label of value.selected) {
            const note = (value.notes[label] ?? '').trim()
            if (note !== '') parts.push(`${label}: ${note}`)
          }
        } else {
          const note = (value.notes[value.selected[0] ?? ''] ?? '').trim()
          if (note !== '') parts.push(note)
        }
        if (custom !== '') parts.push(custom)
        const text = parts.join('\n')
        return {
          id: item.id,
          selected: value.selected,
          ...(text === '' ? {} : { custom: text }),
        }
      }),
    }
    setBusy('answer')
    setError(null)
    // The external-store render can lag the carrier as a timed call continues.
    // Read the channel used by answer() in this same event turn.
    const channel = pending.snapshot().channel
    sentVia.current = channel === 'waterfall' ? 'waterfall' : null
    void pending.answer(answer)
      .then(() => {
        if (channel !== 'rpc') return
        sentVia.current = null
        setBusy(null)
        setError(null)
        void pending.dismiss().catch(() => { setError({ key: 'status.sent' }) })
      })
      .catch((cause: unknown) => {
        sentVia.current = null
        setBusy(null)
        setError({ text: cause instanceof Error ? cause.message : String(cause) })
      })
  }

  const continueFlow = (): void => {
    if (!answered(draft)) {
      setError({ key: 'error.unanswered' })
      return
    }
    if (index < questions.length - 1) {
      replaceProgress(index + 1, drafts)
      setError(null)
      return
    }
    submitDrafts(drafts)
  }

  // Each option's supplement note is stored under its own label: typing under
  // one option never touches another option's note, the selection, or the
  // bottom free-text answer.
  const noteDraft = (label: string, event: ChangeEvent<HTMLTextAreaElement>): void => {
    const value = event.target.value
    updateDraft(current => ({
      ...current,
      notes: { ...current.notes, [label]: value },
      skipped: false,
    }))
  }

  // The bottom free-text field keeps the official semantics: a single-select
  // custom answer replaces the selection, a multi-select one accompanies it.
  const draftCustom = (event: ChangeEvent<HTMLTextAreaElement>): void => {
    const value = event.target.value
    updateDraft(current => ({
      ...current,
      selected: question.multiSelect === true ? current.selected : [],
      custom: value,
      skipped: false,
    }))
  }

  const continueFromCustom = (event: KeyboardEvent<HTMLTextAreaElement>): void => {
    if (event.key !== 'Enter' || event.shiftKey || isComposing(event)) return
    event.preventDefault()
    continueFlow()
  }

  const skipQuestion = (): void => {
    engage()
    const nextDrafts = drafts.map((item, itemIndex) => itemIndex === index
      ? { selected: [], notes: {}, custom: '', skipped: true }
      : item)
    replaceProgress(index < questions.length - 1 ? index + 1 : index, nextDrafts)
    setError(null)
    if (index < questions.length - 1) {
      return
    }
    submitDrafts(nextDrafts)
  }

  return (
    <div className={css.frame} data-question-key={pending.key}>
      <section
        className={clsx(css.card, minimized && css.cardMinimized)}
        aria-labelledby={`question-${pending.key}-${String(index)}`}
      >
        <header className={css.header}>
          <div className={css.headingBlock}>
            {question.header !== undefined && <div className={css.eyebrow}>{question.header}</div>}
            <h2 className={css.title} id={`question-${pending.key}-${String(index)}`}>
              {question.question}
            </h2>
          </div>
          <div className={css.headerActions}>
            {countdown !== undefined && card.waitState !== 'waiting' && card.waitState !== 'editing' && card.waitState !== 'continued' && (
              <span className={css.waitStatus}>
                {t(countdown.running ? 'wait.countdown' : 'wait.paused', {
                  seconds: Math.ceil(countdown.remainingMs / 1000),
                })}
              </span>
            )}
            {countdown !== undefined && card.waitState !== 'waiting' && card.waitState !== 'editing' && card.waitState !== 'continued' && (
              <Button variant="outline" className={css.waitButton} onClick={takeTime}>
                {t('wait.takeTime')}
              </Button>
            )}
            {card.state === 'continued' && <span className={css.waitStatus}>{t('wait.continued')}</span>}
            {/* A held or frozen countdown says so; a request that never carried
                one waits silently, as the blocking question always has. */}
            {countdown !== undefined && (card.waitState === 'waiting' || card.waitState === 'editing') && (
              <span className={css.waitStatus}>{t('wait.held')}</span>
            )}
            {review !== undefined && <span className={css.waitStatus}>{t('review.status')}</span>}
            <button
              type="button" className={css.iconButton}
              aria-label={t(minimized ? 'nav.maximize' : 'nav.minimize')}
              title={t(minimized ? 'nav.maximize' : 'nav.minimize')}
              aria-expanded={!minimized}
              disabled={busy !== null}
              onClick={() => { setMinimized(current => !current) }}
            >
              {minimized ? <IconChevronUpOutlineRegular /> : <IconChevronDownOutlineRegular />}
            </button>
            <button
              type="button" className={css.iconButton}
              aria-label={t(pending.dismissal === 'hide' ? 'nav.close' : 'nav.cancel')}
              title={t(pending.dismissal === 'hide' ? 'nav.close' : 'nav.cancel')}
              disabled={busy !== null} onClick={dismissFlow}
            >
              <IconCloseOutlineRegular />
            </button>
          </div>
        </header>

        {!minimized && (
          <>
            <div
              ref={answerSurface}
              className={css.body}
              data-question-scroll
              onFocusCapture={focusAnswerSurface}
              onBlurCapture={blurAnswerSurface}
            >
              {question.detail !== undefined && (
                <div className={css.detail}><MarkdownText text={question.detail} labels={markdownLabels} /></div>
              )}
              <div className={css.options} role={question.multiSelect === true ? 'group' : 'radiogroup'}>
                {(question.options ?? []).map((option, optionIndex) => {
                  const selected = draft.selected.includes(option.label)
                  const display = parseRecommendedLabel(option.label)
                  // Every SELECTED option carries its own note input directly
                  // beneath it; the note lives under its label and never moves
                  // to another option. Deselecting hides the input (its text
                  // stays in the draft and returns with the selection).
                  const supplementHere = review === undefined && !locked && selected
                  return (
                    <Fragment key={`${option.label}-${String(optionIndex)}`}>
                      <button
                        type="button"
                        className={clsx(css.option, selected && question.multiSelect !== true && css.optionSelected)}
                        role={question.multiSelect === true ? 'checkbox' : 'radio'}
                        aria-checked={selected}
                        aria-label={display.label}
                        disabled={locked}
                        onClick={() => { choose(option.label) }}
                        onKeyDown={(event) => {
                          if (event.key !== 'Enter') return
                          event.preventDefault()
                          submitDrafts(drafts)
                        }}
                      >
                        {question.multiSelect === true
                          ? (
                            <span className={clsx(css.checkbox, selected && css.checkboxChecked)} aria-hidden="true">
                              {selected && <IconCheckOutlineRegular size={12} />}
                            </span>
                          )
                          : <span className={css.number}>{optionIndex + 1}</span>}
                        <span className={css.optionCopy}>
                          <span className={css.optionLine}>
                            <span className={css.optionLabel}>{display.label}</span>
                            {display.recommended && (
                              <span className={css.badge}>{t('option.recommended')}</span>
                            )}
                            {option.description !== undefined && (
                              <span className={css.description}>{option.description}</span>
                            )}
                          </span>
                        </span>
                      </button>
                      {supplementHere && (
                        <div className={css.supplementRow}>
                          <AnswerField
                            variant="inline"
                            value={draft.notes[option.label] ?? ''}
                            disabled={locked}
                            placeholder={t(isLastQuestion ? 'supplement.placeholder.last' : 'supplement.placeholder.next')}
                            onChange={(event) => { noteDraft(option.label, event) }}
                            onKeyDown={continueFromCustom}
                          />
                        </div>
                      )}
                    </Fragment>
                  )
                })}

                {review !== undefined && draft.skipped && (
                  <p className={css.reviewNote}>{t('review.skipped')}</p>
                )}

                {/* The free-text row stays for questions with options as an
                    alternative answer; with a selection it now coexists with
                    the choice instead of replacing it. A review card keeps it
                    only when the recorded answer used it. */}
                {(review === undefined || draft.custom !== '') && (hasOptions
                  ? (
                    <div className={clsx(css.customRow, draft.custom !== '' && css.customRowActive)}>
                      {question.multiSelect === true
                        ? (
                          <span
                            className={clsx(css.checkbox, draft.custom !== '' && css.checkboxChecked)}
                            aria-hidden="true"
                          >
                            {draft.custom !== '' && <IconCheckOutlineRegular size={12} />}
                          </span>
                        )
                        : (
                          <span className={css.number} aria-hidden="true">
                            <IconEditOutlineRegular size={12} />
                          </span>
                        )}
                      <AnswerField
                        variant="inline"
                        value={draft.custom}
                        disabled={locked}
                        placeholder={t('custom.placeholder')}
                        onChange={draftCustom}
                        onKeyDown={continueFromCustom}
                      />
                    </div>
                  )
                  : (
                    <AnswerField
                      // A missing countdown does not imply an indefinite request:
                      // a timed request can still be awaiting its claim's first frame.
                      autoFocus={canSubmit && countdown === undefined && !locked && !focusedQuestions.current.has(index)}
                      variant="block"
                      value={draft.custom}
                      disabled={locked}
                      placeholder={t('custom.placeholder')}
                      onFocus={() => { focusedQuestions.current.add(index) }}
                      onChange={draftCustom}
                      onKeyDown={continueFromCustom}
                    />
                  ))}
              </div>
            </div>

            <footer className={css.footer}>
              <div className={css.pager}>
                <button
                  type="button" className={css.iconButton} aria-label={t('nav.prev')}
                  disabled={index === 0 || busy !== null}
                  onClick={() => { replaceProgress(index - 1, drafts); setError(null) }}
                >
                  <IconChevronLeftOutlineRegular />
                </button>
                <span className={css.progress}>{index + 1} / {questions.length}</span>
                <button
                  type="button" className={css.iconButton} aria-label={t('nav.next')}
                  disabled={isLastQuestion || busy !== null}
                  onClick={() => { replaceProgress(index + 1, drafts); setError(null) }}
                >
                  <IconChevronRightOutlineRegular />
                </button>
              </div>
              <div className={css.feedback} role="status">
                {error === null ? null : 'key' in error ? t(error.key) : error.text}
              </div>
              {/* A review card has nothing to send: the pager alone walks the record. */}
              {review === undefined && (
                <div className={css.footerActions}>
                  <Button variant="outline" disabled={busy !== null} onClick={skipQuestion}>
                    {t('action.skip')}
                  </Button>
                  <Button
                    variant="primary"
                    disabled={busy !== null || !answered(draft) || (isLastQuestion && !canSubmit)}
                    onClick={continueFlow}
                  >
                    {busy === 'answer'
                      ? t('submitting')
                      : isLastQuestion ? t('submit') : t('action.next')}
                  </Button>
                </div>
              )}
            </footer>
          </>
        )}
      </section>
    </div>
  )
}
