/**
 * Browser half of dsh-question-note: an enhanced `ask_user_question`
 * composer registered into the conversation-declared composer chain at a
 * lower priority than the official entry, so its selector runs first and
 * claims generic pending-question carriers. Plan-review carriers, approval
 * cards and every other pending interaction fall through to their own
 * registered entries; when the carrier structure stops matching, the select
 * returns null and the official composer keeps the seat unchanged.
 */
import type { Context as ClientContext } from '@deepseek-ai/cordis'
import { createQuestionNoteDraftStore } from './draft-store.ts'
import { QuestionNoteComposer } from './composer.tsx'
import { selectQuestionCarrier } from './carrier.ts'
import { en, zh, type QuestionNoteKey } from './locales.ts'

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** The enhanced question composer's copy. */
    'question-note': QuestionNoteKey
  }
}

/** Required services: the Slot registry and the locale dictionary seat. */
export const inject = ['slots', 'locale']

/** Dictionary namespace owned by this plugin. */
const NS = 'question-note'

/** Chain election order: the official composer sits at the default 0. */
const CHAIN_PRIORITY = -10

/**
 * Client plugin body: register the dictionaries and the enhanced composer.
 * @param ctx - client root context.
 */
export function apply(ctx: ClientContext): void {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'dsh-question-note: dictionaries')
  const questionNoteDraftStore = createQuestionNoteDraftStore()
  ctx.effect(() => ctx.slots.inject('conversation.composer', () => ctx.slots.register(
    {
      name: 'conversation.composer',
      priority: CHAIN_PRIORITY,
      select: selectQuestionCarrier,
      locale: NS,
      store: questionNoteDraftStore,
    },
    QuestionNoteComposer,
  )), 'dsh-question-note: composer')
}
