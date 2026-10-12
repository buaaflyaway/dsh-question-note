window.__ModuleLoader__.load({
	id: "dsh-question-note",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let _deepseek_ai_dsh_client_store = require("@deepseek-ai/dsh-client-store");
		let react = require("react");
		let _deepseek_ai_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
		let react_jsx_runtime = require("react/jsx-runtime");
		//#region src/client/draft-store.ts
		/**
		* Session-scoped draft state for the enhanced question composer. Same shape
		* and semantics as the official `question` draft store, under its own
		* persistence key so the two composers can never overwrite each other's
		* drafts. The Slot registry owns store instances; this module exports only
		* the factory so a plugin reload cannot reuse a module-global handle.
		*/
		/**
		* Declare the enhanced question composer's Session store.
		* @returns a persisted store handle whose instance is owned by the Slot registry.
		*/
		function createQuestionNoteDraftStore() {
			return (0, _deepseek_ai_dsh_client_store.defineStore)({
				init: () => ({ progressByRequest: {} }),
				persist: "dsh.question-note.drafts.v2",
				actions: {
					replace: (draft, requestKey, progress) => {
						draft.progressByRequest[requestKey] = progress;
					},
					clear: (draft, requestKey) => {
						draft.progressByRequest = Object.fromEntries(Object.entries(draft.progressByRequest).filter(([key]) => key !== requestKey));
					},
					prune: (draft, keep) => {
						const live = new Set(keep);
						draft.progressByRequest = Object.fromEntries(Object.entries(draft.progressByRequest).filter(([key]) => live.has(key)));
					}
				}
			});
		}
		//#endregion
		//#region node_modules/.pnpm/clsx@2.1.1/node_modules/clsx/dist/clsx.mjs
		function r(e) {
			var t, f, n = "";
			if ("string" == typeof e || "number" == typeof e) n += e;
			else if ("object" == typeof e) if (Array.isArray(e)) {
				var o = e.length;
				for (t = 0; t < o; t++) e[t] && (f = r(e[t])) && (n && (n += " "), n += f);
			} else for (f in e) e[f] && (n && (n += " "), n += f);
			return n;
		}
		function clsx() {
			for (var e, t, f = 0, n = "", o = arguments.length; f < o; f++) (e = arguments[f]) && (t = r(e)) && (n && (n += " "), n += t);
			return n;
		}
		//#endregion
		//#region \0dsh-css:D:\Documents\deepseek-harness\default-workspace\dsh-question-note\src\client\composer.module.css.mjs
		const css = ".AXwVla_frame{padding:6px calc(var(--dsh-composer-side-clearance) + 16px) 10px;justify-content:center;display:flex}.AXwVla_card{width:100%;max-width:var(--dsh-chat-content-width);--dsw-elevation-stroke-color:var(--dsw-alias-border-l2-darkmode-thin);border-radius:var(--dsw-radius-xl);background:var(--dsw-specific-input-major);max-height:min(60vh,520px);box-shadow:var(--dsw-elevation-panel);color:var(--dsw-alias-label-primary);--dsh-scrollbar-thumb:var(--dsw-alias-scrollbar-bg-l2);--dsh-scrollbar-thumb-hover:var(--dsw-alias-scrollbar-hover-l2);border:0;flex-direction:column;padding:0 0 10px;display:flex;overflow:hidden}.AXwVla_card,.AXwVla_card *{box-sizing:border-box}.AXwVla_cardMinimized{max-height:none}.AXwVla_cardMinimized .AXwVla_header{padding-bottom:14px}.AXwVla_headerActions{flex-shrink:0;align-items:center;gap:4px;display:flex}.AXwVla_waitButton{white-space:nowrap}.AXwVla_waitStatus{color:var(--dsw-alias-label-secondary);white-space:nowrap;font-size:12px;line-height:24px}.AXwVla_header{flex-shrink:0;justify-content:space-between;align-items:flex-start;gap:16px;padding:20px 16px 0 24px;display:flex}.AXwVla_headingBlock{min-width:0}.AXwVla_eyebrow{color:var(--dsw-alias-label-tertiary);margin-bottom:5px;font-size:11px;line-height:16px}.AXwVla_title{margin:0;font-size:16px;font-weight:500;line-height:22px}.AXwVla_detail{margin:0 2px 8px}.AXwVla_footerActions{flex-shrink:0;align-items:center;gap:12px;display:flex}.AXwVla_pager{flex-shrink:0;align-items:center;gap:6px;display:flex}.AXwVla_progress{color:var(--dsw-alias-label-secondary);white-space:nowrap;word-spacing:-2px;padding:0 4px;font-size:14px;font-weight:500;line-height:24px}.AXwVla_iconButton{corner-shape:round;width:24px;height:24px;color:var(--dsw-alias-label-tertiary);cursor:pointer;background:0 0;border:none;border-radius:999px;place-items:center;padding:0;display:grid}.AXwVla_iconButton:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.AXwVla_iconButton:disabled{color:var(--dsw-alias-label-dimmed);cursor:default}.AXwVla_body{overscroll-behavior:contain;flex-direction:column;flex:auto;min-height:0;display:flex;overflow-y:auto}.AXwVla_options{flex-direction:column;gap:1px;margin:8px 0 0;padding:4px 12px;display:flex}.AXwVla_option{border-radius:var(--dsw-radius-md);width:100%;min-height:40px;color:inherit;text-align:left;cursor:pointer;background:0 0;border:1px solid #0000;flex-shrink:0;align-items:flex-start;gap:8px;padding:8px 12px 8px 8px;transition:background-color .12s,border-color .12s;display:flex}.AXwVla_option:hover:not(:disabled),.AXwVla_optionSelected{background:var(--dsw-alias-interactive-bg-hover)}.AXwVla_optionSelected{border-color:var(--dsw-alias-border-l2)}.AXwVla_option:disabled{cursor:default}.AXwVla_number{border-radius:var(--dsw-radius-xs);background:var(--dsw-alias-bg-overlay);width:20px;height:20px;color:var(--dsw-alias-label-secondary);flex:0 0 20px;place-items:center;margin-top:2px;font-size:12px;font-weight:500;line-height:18px;display:grid}.AXwVla_checkbox{flex:0 0 20px;place-items:center;width:20px;height:20px;margin-top:2px;display:grid}.AXwVla_checkbox:before{content:\"\";border:.5px solid var(--dsw-alias-border-l4);border-radius:var(--dsw-radius-xs);grid-area:1/1;width:14px;height:14px;transition:background-color .12s,border-color .12s}.AXwVla_checkbox>svg{grid-area:1/1}.AXwVla_checkboxChecked{color:var(--dsw-alias-label-primary-foreground)}.AXwVla_checkboxChecked:before{border-color:var(--dsw-alias-label-primary);background:var(--dsw-alias-label-primary)}.AXwVla_optionCopy{flex:1;min-width:0}.AXwVla_optionLine{flex-wrap:wrap;align-items:baseline;gap:2px 6px;display:flex}.AXwVla_optionLabel{font-size:14px;font-weight:500;line-height:24px}.AXwVla_badge{border-radius:var(--dsw-radius-xs);background:var(--dsw-specific-sidebar-nav-item-active-accent);color:var(--dsw-alias-button-info-fill);padding:0 4px;font-size:11px;font-weight:600;line-height:18px}.AXwVla_description{color:var(--dsw-alias-label-tertiary);font-size:14px;font-weight:400;line-height:24px}.AXwVla_reviewNote{color:var(--dsw-alias-label-tertiary);margin:0;padding:8px 12px;font-size:14px;line-height:24px}.AXwVla_customRow{border-radius:var(--dsw-radius-md);border:1px solid #0000;flex-shrink:0;align-items:flex-start;gap:8px;width:100%;min-height:40px;padding:8px 12px 8px 8px;transition:background-color .12s,border-color .12s;display:flex}.AXwVla_customRow:hover,.AXwVla_customRow:focus-within,.AXwVla_customRowActive{background:var(--dsw-alias-interactive-bg-hover)}.AXwVla_customRow:focus-within,.AXwVla_customRowActive{border-color:var(--dsw-alias-border-l2)}.AXwVla_supplementRow{border:1px solid var(--dsw-alias-border-l2);border-radius:var(--dsw-radius-md);background:var(--dsw-alias-bg-module-platform);flex-shrink:0;align-items:flex-start;gap:8px;min-height:36px;margin:2px 0 4px 28px;padding:6px 12px;transition:border-color .12s;display:flex}.AXwVla_supplementRow:focus-within{border-color:var(--dsw-alias-state-business-primary)}.AXwVla_field{--dsh-answer-field-padding:0;min-width:0;display:grid}.AXwVla_field>*{min-width:0;padding:var(--dsh-answer-field-padding);font:inherit;white-space:pre-wrap;word-break:break-word;overflow-wrap:anywhere;grid-area:1/1;font-size:14px;line-height:24px}.AXwVla_fieldMirror{box-sizing:content-box;visibility:hidden;max-height:144px;overflow:hidden}.AXwVla_fieldInput{resize:none;color:var(--dsw-alias-label-primary);caret-color:var(--dsw-alias-state-business-primary);background:0 0;border:none;outline:none;overflow-y:auto}.AXwVla_fieldInput::placeholder{color:var(--dsw-alias-label-caption)}.AXwVla_customInline{flex:1}.AXwVla_customBlock{border:.5px solid var(--dsw-alias-border-l4);border-radius:var(--dsw-radius-lg);background:var(--dsw-alias-bg-module-platform);--dsh-answer-field-padding:8px 12px;flex-shrink:0;min-height:64px;margin:0 12px}.AXwVla_customBlock:focus-within{border-color:var(--dsw-alias-state-business-primary)}.AXwVla_footer{flex-shrink:0;justify-content:space-between;align-items:center;gap:12px;margin-top:12px;padding:0 10px 0 18px;display:flex}.AXwVla_feedback{min-height:16px;color:var(--dsw-alias-state-error-primary);text-align:right;flex:1;font-size:11px;line-height:16px}@media (width<=720px){.AXwVla_card{border-radius:var(--dsw-radius-xl)}.AXwVla_header{padding:10px 12px 0 18px}.AXwVla_options{padding:4px 8px}.AXwVla_title{font-size:15px;line-height:21px}.AXwVla_option,.AXwVla_customRow,.AXwVla_supplementRow{padding:8px 6px}.AXwVla_footer{align-items:flex-end;padding:0 10px}.AXwVla_footerActions{flex-shrink:0}}@media (prefers-reduced-motion:reduce){.AXwVla_option,.AXwVla_customRow,.AXwVla_supplementRow{transition:none}}";
		const tagId = "dsh-question-note/composer.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-question-note";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		var composer_module_css_default = {
			"badge": "AXwVla_badge",
			"body": "AXwVla_body",
			"card": "AXwVla_card",
			"cardMinimized": "AXwVla_cardMinimized",
			"checkbox": "AXwVla_checkbox",
			"checkboxChecked": "AXwVla_checkboxChecked",
			"customBlock": "AXwVla_customBlock",
			"customInline": "AXwVla_customInline",
			"customRow": "AXwVla_customRow",
			"customRowActive": "AXwVla_customRowActive",
			"description": "AXwVla_description",
			"detail": "AXwVla_detail",
			"eyebrow": "AXwVla_eyebrow",
			"feedback": "AXwVla_feedback",
			"field": "AXwVla_field",
			"fieldInput": "AXwVla_fieldInput",
			"fieldMirror": "AXwVla_fieldMirror",
			"footer": "AXwVla_footer",
			"footerActions": "AXwVla_footerActions",
			"frame": "AXwVla_frame",
			"header": "AXwVla_header",
			"headerActions": "AXwVla_headerActions",
			"headingBlock": "AXwVla_headingBlock",
			"iconButton": "AXwVla_iconButton",
			"number": "AXwVla_number",
			"option": "AXwVla_option",
			"optionCopy": "AXwVla_optionCopy",
			"optionLabel": "AXwVla_optionLabel",
			"optionLine": "AXwVla_optionLine",
			"optionSelected": "AXwVla_optionSelected",
			"options": "AXwVla_options",
			"pager": "AXwVla_pager",
			"progress": "AXwVla_progress",
			"reviewNote": "AXwVla_reviewNote",
			"supplementRow": "AXwVla_supplementRow",
			"title": "AXwVla_title",
			"waitButton": "AXwVla_waitButton",
			"waitStatus": "AXwVla_waitStatus"
		};
		//#endregion
		//#region src/client/composer.tsx
		/** A removed card can remain mounted until the composer seat updates. */
		const REMOVED_CARD = {
			state: "open",
			waitState: "counting",
			countdown: void 0,
			channel: "none",
			closed: true
		};
		/**
		* Split the conventional recommendation suffix without changing the answer value.
		* @param label - Original option label returned if selected.
		* @returns Display label plus recommendation state.
		*/
		function parseRecommendedLabel(label) {
			const suffix = /\s*(?:\((?:recommended|推荐)\)|（(?:recommended|推荐)）)\s*$/i;
			return suffix.test(label) ? {
				label: label.replace(suffix, ""),
				recommended: true
			} : {
				label,
				recommended: false
			};
		}
		/** Only a marked first choice is an implicit draft; the user still submits it. */
		function recommendedFirstOption(question) {
			const label = question.options?.[0]?.label;
			return label !== void 0 && parseRecommendedLabel(label).recommended ? label : void 0;
		}
		/** Accept persisted progress only when it still describes this question batch. */
		function isQuestionDraftProgress(value, questionCount) {
			if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
			const progress = value;
			if (typeof progress.index !== "number" || !Number.isInteger(progress.index) || progress.index < 0 || progress.index >= questionCount || !Array.isArray(progress.drafts) || progress.drafts.length !== questionCount || progress.wait !== void 0 && progress.wait !== "editing" && progress.wait !== "waiting") return false;
			return progress.drafts.every((item) => {
				if (typeof item !== "object" || item === null || Array.isArray(item)) return false;
				const draft = item;
				return Array.isArray(draft.selected) && draft.selected.every((label) => typeof label === "string") && typeof draft.custom === "string" && typeof draft.skipped === "boolean" && (draft.notes === void 0 || typeof draft.notes === "object" && draft.notes !== null && !Array.isArray(draft.notes) && Object.values(draft.notes).every((note) => typeof note === "string"));
			});
		}
		/** Return whether a text-field key event belongs to an active IME composition. */
		function isComposing(event) {
			return event.nativeEvent.isComposing || Reflect.get(event.nativeEvent, "keyCode") === 229;
		}
		/**
		* Auto-growing free-text field: a textarea over a hidden mirror that owns the
		* height (same mechanism as the official composer; mirror and textarea MUST
		* share font, line-height, padding and wrapping rules).
		*
		* @param props - visual variant, draft text, and the field's event handlers.
		* @returns The mirrored auto-growing field.
		*/
		function AnswerField(props) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: clsx(composer_module_css_default.field, props.variant === "inline" ? composer_module_css_default.customInline : composer_module_css_default.customBlock),
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					"aria-hidden": true,
					className: composer_module_css_default.fieldMirror,
					children: `${props.value}\n`
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("textarea", {
					autoFocus: props.autoFocus,
					className: composer_module_css_default.fieldInput,
					value: props.value,
					disabled: props.disabled,
					rows: 1,
					placeholder: props.placeholder,
					onFocus: props.onFocus,
					onChange: props.onChange,
					onKeyDown: props.onKeyDown
				})]
			});
		}
		/**
		* The enhanced question flow. Renders the carrier's current question and its
		* draft, reveals the supplement note under the selected option, and submits
		* `{ selected, custom }` together through the carrier's channel.
		* @param props - the chain-matched carrier plus the framework standard kit.
		* @returns The enhanced question card.
		*/
		function QuestionNoteComposer(props) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(QuestionNoteFlow, {
				pending: props.matched,
				t: props.t,
				useStore: props.useStore,
				actions: props.actions
			}, props.matched.key);
		}
		function QuestionNoteFlow({ pending, t, useStore, actions }) {
			const questions = pending.questions;
			const review = pending.review;
			const markdownLabels = (0, react.useMemo)(() => ({
				code: {
					copyLabel: t("copy"),
					copiedLabel: t("copied"),
					toolbarLabels: {
						codeLabel: t("codeBlock.title"),
						wrapLabel: t("codeBlock.wrap"),
						unwrapLabel: t("codeBlock.unwrap")
					}
				},
				footnotes: t("markdown.footnotes")
			}), [t]);
			const initialDrafts = (0, react.useMemo)(() => {
				const recorded = new Map((review ?? []).map((answer) => [answer.id, answer]));
				return questions.map((item) => {
					const answer = recorded.get(item.id);
					const custom = answer?.custom ?? "";
					const recommended = review === void 0 ? recommendedFirstOption(item) : void 0;
					return {
						selected: answer === void 0 && recommended !== void 0 ? [recommended] : [...answer?.selected ?? []],
						notes: {},
						custom,
						skipped: answer !== void 0 && answer.selected.length === 0 && custom === ""
					};
				});
			}, [questions, review]);
			const stored = useStore((state) => state.progressByRequest[pending.key]);
			const validStored = isQuestionDraftProgress(stored, questions.length) ? stored : void 0;
			const storedProgress = review === void 0 ? validStored : void 0;
			const index = validStored?.index ?? 0;
			const drafts = (storedProgress?.drafts ?? initialDrafts).map((item) => ({
				...item,
				notes: item.notes ?? {}
			}));
			const restoredWait = storedProgress?.wait ?? (storedProgress?.drafts.some((item, itemIndex) => item.selected.length !== initialDrafts[itemIndex]?.selected.length || item.selected.some((label, labelIndex) => label !== initialDrafts[itemIndex]?.selected[labelIndex]) || Object.values(item.notes ?? {}).some((note) => note !== "") || item.custom !== "" || item.skipped) === true ? "editing" : void 0);
			const [busy, setBusy] = (0, react.useState)(null);
			const [error, setError] = (0, react.useState)(null);
			const card = (0, react.useSyncExternalStore)(pending.subscribe, pending.snapshot) ?? REMOVED_CARD;
			const canSubmit = card.channel !== "none";
			const locked = busy !== null || review !== void 0;
			const sentVia = (0, react.useRef)(null);
			(0, react.useEffect)(() => {
				if (sentVia.current !== "waterfall" || card.state !== "continued") return;
				sentVia.current = null;
				setBusy(null);
				setError({ key: "error.resubmit" });
			}, [card.state]);
			(0, react.useEffect)(() => {
				if (card.closed) actions.clear(pending.key);
			}, [
				actions,
				card.closed,
				pending.key
			]);
			(0, react.useEffect)(() => {
				actions.prune(pending.liveKeys());
			}, [pending]);
			const waitDisposition = (0, react.useRef)(restoredWait);
			(0, react.useEffect)(() => {
				if (waitDisposition.current === "waiting") pending.takeTime();
				if (waitDisposition.current === "editing") pending.engage();
			}, [pending]);
			const countdown = card.countdown;
			const [minimized, setMinimized] = (0, react.useState)(false);
			const focusedQuestions = (0, react.useRef)(/* @__PURE__ */ new Set());
			const answerSurface = (0, react.useRef)(null);
			const question = questions[index];
			const draft = drafts[index];
			const hasOptions = (question.options?.length ?? 0) > 0;
			const isLastQuestion = index === questions.length - 1;
			const replaceProgress = (nextIndex, nextDrafts) => {
				actions.replace(pending.key, {
					index: nextIndex,
					drafts: nextDrafts,
					...waitDisposition.current === void 0 ? {} : { wait: waitDisposition.current }
				});
			};
			const takeTime = () => {
				waitDisposition.current = "waiting";
				pending.takeTime();
				replaceProgress(index, drafts);
			};
			const engage = () => {
				if (waitDisposition.current !== void 0) return;
				waitDisposition.current = "editing";
				pending.engage();
			};
			const focusAnswerSurface = (event) => {
				if (!event.currentTarget.contains(event.relatedTarget)) pending.holdFocus();
			};
			const blurAnswerSurface = (event) => {
				if (!event.currentTarget.contains(event.relatedTarget)) pending.releaseFocus();
			};
			(0, react.useEffect)(() => {
				const release = () => {
					pending.releaseFocus();
				};
				const refocus = () => {
					if (waitDisposition.current === "editing") {
						pending.engage();
						return;
					}
					if (answerSurface.current?.contains(document.activeElement) === true) pending.holdFocus();
				};
				const visibilityChanged = () => {
					if (document.hidden) release();
					else refocus();
				};
				window.addEventListener("blur", release);
				window.addEventListener("focus", refocus);
				document.addEventListener("visibilitychange", visibilityChanged);
				return () => {
					release();
					window.removeEventListener("blur", release);
					window.removeEventListener("focus", refocus);
					document.removeEventListener("visibilitychange", visibilityChanged);
				};
			}, [pending]);
			const dismissFlow = () => {
				if (pending.dismissal === "hide") {
					pending.dismiss();
					return;
				}
				if (!canSubmit) {
					setError({ key: "error.unavailable" });
					return;
				}
				setBusy("cancel");
				setError(null);
				sentVia.current = "waterfall";
				pending.dismiss().catch((cause) => {
					sentVia.current = null;
					setBusy(null);
					setError({ text: cause instanceof Error ? cause.message : String(cause) });
				});
			};
			const updateDraft = (update, nextIndex = index) => {
				engage();
				const nextDrafts = drafts.map((item, itemIndex) => itemIndex === index ? update(item) : item);
				replaceProgress(nextIndex, nextDrafts);
				setError(null);
			};
			const choose = (label) => {
				updateDraft((current) => {
					if (question.multiSelect === true) {
						const selected = current.selected.includes(label) ? current.selected.filter((item) => item !== label) : [...current.selected, label];
						return {
							...current,
							selected,
							skipped: false
						};
					}
					return {
						selected: [label],
						custom: "",
						skipped: false
					};
				});
			};
			const answered = (item) => item.selected.length > 0 || item.custom.trim() !== "";
			const completed = (item) => answered(item) || item.skipped;
			const submitDrafts = (values) => {
				const missing = values.findIndex((item) => !completed(item));
				if (missing >= 0) {
					replaceProgress(missing, values);
					setError({ key: "error.incomplete" });
					return;
				}
				if (!canSubmit) {
					setError({ key: "error.unavailable" });
					return;
				}
				const answer = { answers: questions.map((item, itemIndex) => {
					const value = values[itemIndex];
					if (value.skipped) return {
						id: item.id,
						selected: []
					};
					const custom = value.custom.trim();
					const parts = [];
					if (item.multiSelect === true) for (const label of value.selected) {
						const note = (value.notes[label] ?? "").trim();
						if (note !== "") parts.push(`${label}: ${note}`);
					}
					else {
						const note = (value.notes[value.selected[0] ?? ""] ?? "").trim();
						if (note !== "") parts.push(note);
					}
					if (custom !== "") parts.push(custom);
					const text = parts.join("\n");
					return {
						id: item.id,
						selected: value.selected,
						...text === "" ? {} : { custom: text }
					};
				}) };
				setBusy("answer");
				setError(null);
				const channel = pending.snapshot().channel;
				sentVia.current = channel === "waterfall" ? "waterfall" : null;
				pending.answer(answer).then(() => {
					if (channel !== "rpc") return;
					sentVia.current = null;
					setBusy(null);
					setError(null);
					pending.dismiss().catch(() => {
						setError({ key: "status.sent" });
					});
				}).catch((cause) => {
					sentVia.current = null;
					setBusy(null);
					setError({ text: cause instanceof Error ? cause.message : String(cause) });
				});
			};
			const continueFlow = () => {
				if (!answered(draft)) {
					setError({ key: "error.unanswered" });
					return;
				}
				if (index < questions.length - 1) {
					replaceProgress(index + 1, drafts);
					setError(null);
					return;
				}
				submitDrafts(drafts);
			};
			const noteDraft = (label, event) => {
				const value = event.target.value;
				updateDraft((current) => ({
					...current,
					notes: {
						...current.notes,
						[label]: value
					},
					skipped: false
				}));
			};
			const draftCustom = (event) => {
				const value = event.target.value;
				updateDraft((current) => ({
					...current,
					selected: question.multiSelect === true ? current.selected : [],
					custom: value,
					skipped: false
				}));
			};
			const continueFromCustom = (event) => {
				if (event.key !== "Enter" || event.shiftKey || isComposing(event)) return;
				event.preventDefault();
				continueFlow();
			};
			const skipQuestion = () => {
				engage();
				const nextDrafts = drafts.map((item, itemIndex) => itemIndex === index ? {
					selected: [],
					notes: {},
					custom: "",
					skipped: true
				} : item);
				replaceProgress(index < questions.length - 1 ? index + 1 : index, nextDrafts);
				setError(null);
				if (index < questions.length - 1) return;
				submitDrafts(nextDrafts);
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: composer_module_css_default.frame,
				"data-question-key": pending.key,
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
					className: clsx(composer_module_css_default.card, minimized && composer_module_css_default.cardMinimized),
					"aria-labelledby": `question-${pending.key}-${String(index)}`,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("header", {
						className: composer_module_css_default.header,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: composer_module_css_default.headingBlock,
							children: [question.header !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: composer_module_css_default.eyebrow,
								children: question.header
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", {
								className: composer_module_css_default.title,
								id: `question-${pending.key}-${String(index)}`,
								children: question.question
							})]
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: composer_module_css_default.headerActions,
							children: [
								countdown !== void 0 && card.waitState !== "waiting" && card.waitState !== "editing" && card.waitState !== "continued" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: composer_module_css_default.waitStatus,
									children: t(countdown.running ? "wait.countdown" : "wait.paused", { seconds: Math.ceil(countdown.remainingMs / 1e3) })
								}),
								countdown !== void 0 && card.waitState !== "waiting" && card.waitState !== "editing" && card.waitState !== "continued" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
									variant: "outline",
									className: composer_module_css_default.waitButton,
									onClick: takeTime,
									children: t("wait.takeTime")
								}),
								card.state === "continued" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: composer_module_css_default.waitStatus,
									children: t("wait.continued")
								}),
								countdown !== void 0 && (card.waitState === "waiting" || card.waitState === "editing") && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: composer_module_css_default.waitStatus,
									children: t("wait.held")
								}),
								review !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: composer_module_css_default.waitStatus,
									children: t("review.status")
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									className: composer_module_css_default.iconButton,
									"aria-label": t(minimized ? "nav.maximize" : "nav.minimize"),
									title: t(minimized ? "nav.maximize" : "nav.minimize"),
									"aria-expanded": !minimized,
									disabled: busy !== null,
									onClick: () => {
										setMinimized((current) => !current);
									},
									children: minimized ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconChevronUpOutlineRegular, {}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconChevronDownOutlineRegular, {})
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									className: composer_module_css_default.iconButton,
									"aria-label": t(pending.dismissal === "hide" ? "nav.close" : "nav.cancel"),
									title: t(pending.dismissal === "hide" ? "nav.close" : "nav.cancel"),
									disabled: busy !== null,
									onClick: dismissFlow,
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCloseOutlineRegular, {})
								})
							]
						})]
					}), !minimized && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						ref: answerSurface,
						className: composer_module_css_default.body,
						"data-question-scroll": true,
						onFocusCapture: focusAnswerSurface,
						onBlurCapture: blurAnswerSurface,
						children: [question.detail !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: composer_module_css_default.detail,
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.MarkdownText, {
								text: question.detail,
								labels: markdownLabels
							})
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: composer_module_css_default.options,
							role: question.multiSelect === true ? "group" : "radiogroup",
							children: [
								(question.options ?? []).map((option, optionIndex) => {
									const selected = draft.selected.includes(option.label);
									const display = parseRecommendedLabel(option.label);
									const supplementHere = review === void 0 && !locked && selected;
									return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
										type: "button",
										className: clsx(composer_module_css_default.option, selected && question.multiSelect !== true && composer_module_css_default.optionSelected),
										role: question.multiSelect === true ? "checkbox" : "radio",
										"aria-checked": selected,
										"aria-label": display.label,
										disabled: locked,
										onClick: () => {
											choose(option.label);
										},
										onKeyDown: (event) => {
											if (event.key !== "Enter") return;
											event.preventDefault();
											submitDrafts(drafts);
										},
										children: [question.multiSelect === true ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: clsx(composer_module_css_default.checkbox, selected && composer_module_css_default.checkboxChecked),
											"aria-hidden": "true",
											children: selected && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCheckOutlineRegular, { size: 12 })
										}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: composer_module_css_default.number,
											children: optionIndex + 1
										}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: composer_module_css_default.optionCopy,
											children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
												className: composer_module_css_default.optionLine,
												children: [
													/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
														className: composer_module_css_default.optionLabel,
														children: display.label
													}),
													display.recommended && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
														className: composer_module_css_default.badge,
														children: t("option.recommended")
													}),
													option.description !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
														className: composer_module_css_default.description,
														children: option.description
													})
												]
											})
										})]
									}), supplementHere && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
										className: composer_module_css_default.supplementRow,
										children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(AnswerField, {
											variant: "inline",
											value: draft.notes[option.label] ?? "",
											disabled: locked,
											placeholder: t(isLastQuestion ? "supplement.placeholder.last" : "supplement.placeholder.next"),
											onChange: (event) => {
												noteDraft(option.label, event);
											},
											onKeyDown: continueFromCustom
										})
									})] }, `${option.label}-${String(optionIndex)}`);
								}),
								review !== void 0 && draft.skipped && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
									className: composer_module_css_default.reviewNote,
									children: t("review.skipped")
								}),
								(review === void 0 || draft.custom !== "") && (hasOptions ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: clsx(composer_module_css_default.customRow, draft.custom !== "" && composer_module_css_default.customRowActive),
									children: [question.multiSelect === true ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: clsx(composer_module_css_default.checkbox, draft.custom !== "" && composer_module_css_default.checkboxChecked),
										"aria-hidden": "true",
										children: draft.custom !== "" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCheckOutlineRegular, { size: 12 })
									}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: composer_module_css_default.number,
										"aria-hidden": "true",
										children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconEditOutlineRegular, { size: 12 })
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(AnswerField, {
										variant: "inline",
										value: draft.custom,
										disabled: locked,
										placeholder: t("custom.placeholder"),
										onChange: draftCustom,
										onKeyDown: continueFromCustom
									})]
								}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(AnswerField, {
									autoFocus: canSubmit && countdown === void 0 && !locked && !focusedQuestions.current.has(index),
									variant: "block",
									value: draft.custom,
									disabled: locked,
									placeholder: t("custom.placeholder"),
									onFocus: () => {
										focusedQuestions.current.add(index);
									},
									onChange: draftCustom,
									onKeyDown: continueFromCustom
								}))
							]
						})]
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("footer", {
						className: composer_module_css_default.footer,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: composer_module_css_default.pager,
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
										type: "button",
										className: composer_module_css_default.iconButton,
										"aria-label": t("nav.prev"),
										disabled: index === 0 || busy !== null,
										onClick: () => {
											replaceProgress(index - 1, drafts);
											setError(null);
										},
										children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconChevronLeftOutlineRegular, {})
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
										className: composer_module_css_default.progress,
										children: [
											index + 1,
											" / ",
											questions.length
										]
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
										type: "button",
										className: composer_module_css_default.iconButton,
										"aria-label": t("nav.next"),
										disabled: isLastQuestion || busy !== null,
										onClick: () => {
											replaceProgress(index + 1, drafts);
											setError(null);
										},
										children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconChevronRightOutlineRegular, {})
									})
								]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: composer_module_css_default.feedback,
								role: "status",
								children: error === null ? null : "key" in error ? t(error.key) : error.text
							}),
							review === void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: composer_module_css_default.footerActions,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
									variant: "outline",
									disabled: busy !== null,
									onClick: skipQuestion,
									children: t("action.skip")
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
									variant: "primary",
									disabled: busy !== null || !answered(draft) || isLastQuestion && !canSubmit,
									onClick: continueFlow,
									children: busy === "answer" ? t("submitting") : isLastQuestion ? t("submit") : t("action.next")
								})]
							})
						]
					})] })]
				})
			});
		}
		//#endregion
		//#region src/client/carrier.ts
		/**
		* Whether the official composer would render this batch as a plan-review
		* decision card (a copy of the official planReviewOf narrowing). The
		* enhancement defers those requests to the official component.
		* @param questions - the request's whole question batch.
		* @returns true when the batch declares a renderable plan-review intent.
		*/
		function isPlanReviewRequest(questions) {
			if (questions.length !== 1) return false;
			const question = questions[0];
			if (question === void 0) return false;
			const intent = question.intent;
			if (intent?.kind !== "plan-review" || question.detail === void 0) return false;
			if (question.multiSelect === true) return false;
			const options = question.options ?? [];
			if (options.length > 2) return false;
			return options.some((option) => option.label === intent.approve);
		}
		/** Structural guard for the carrier method set this composer calls. */
		function isQuestionCarrier(value) {
			if (typeof value !== "object" || value === null) return false;
			const carrier = value;
			return typeof carrier.key === "string" && Array.isArray(carrier.questions) && (carrier.review === void 0 || Array.isArray(carrier.review)) && (carrier.dismissal === "hide" || carrier.dismissal === "cancel") && typeof carrier.subscribe === "function" && typeof carrier.snapshot === "function" && typeof carrier.takeTime === "function" && typeof carrier.engage === "function" && typeof carrier.holdFocus === "function" && typeof carrier.releaseFocus === "function" && typeof carrier.answer === "function" && typeof carrier.dismiss === "function" && typeof carrier.liveKeys === "function";
		}
		/**
		* Chain-slot selector: claim a generic pending-question carrier for this
		* composer and leave every other pending interaction (plan reviews, approval
		* cards, the normal composer) to its own registered entry.
		* @param owner - the chain entry's owner props, carrying the pending interaction.
		* @returns the carrier to render, or null to let the next selector run.
		*/
		function selectQuestionCarrier(owner) {
			const carrier = owner.pendingInteraction;
			if (!isQuestionCarrier(carrier)) return null;
			if (isPlanReviewRequest(carrier.questions)) return null;
			return carrier;
		}
		//#endregion
		//#region src/client/locales.ts
		/** `question-note` namespace dictionaries: the official `question` copy plus the supplement-note keys. */
		/** Simplified Chinese dictionary (the key-set source of truth). */
		const zh = {
			"error.incomplete": "请先完成这道问题。",
			"error.unanswered": "请选择一个选项或填写自定义答案。",
			"error.unavailable": "当前无法提交，请稍候再试。",
			"error.resubmit": "回答未送达，工作已继续，请再提交一次。",
			"status.sent": "回答已发送；面板未能关闭。",
			"wait.takeTime": "慢慢回答",
			"wait.countdown": "{seconds} 秒后继续工作",
			"wait.paused": "已暂停 · 剩余 {seconds} 秒",
			"wait.held": "会一直等你回答",
			"wait.continued": "已继续工作，仍可回答",
			"review.status": "已回答",
			"review.skipped": "这道问题当时被跳过。",
			"nav.prev": "上一题",
			"nav.next": "下一题",
			"nav.minimize": "收起问题卡片",
			"nav.maximize": "展开问题卡片",
			"nav.cancel": "放弃整组问题",
			"nav.close": "收起问题面板，可从工具调用重新打开",
			"option.recommended": "推荐",
			"custom.placeholder": "输入你的答案",
			"action.skip": "跳过",
			"action.next": "下一题",
			"submit": "提交答案",
			"submitting": "提交中…",
			"copy": "复制",
			"copied": "已复制",
			"codeBlock.title": "代码块",
			"codeBlock.wrap": "自动换行",
			"codeBlock.unwrap": "取消换行",
			"markdown.footnotes": "脚注",
			"supplement.placeholder.next": "可补充说明，不需要可留空；回车进入下一题",
			"supplement.placeholder.last": "可补充说明，不需要可留空；回车提交"
		};
		/** English dictionary, checked complete against the zh key set. */
		const en = {
			"error.incomplete": "Please complete this question first.",
			"error.unanswered": "Please select an option or enter a custom answer.",
			"error.unavailable": "Cannot submit right now; try again in a moment.",
			"error.resubmit": "The answer did not arrive before work continued; submit it again.",
			"status.sent": "Reply sent; the panel could not close.",
			"wait.takeTime": "Take time",
			"wait.countdown": "Continuing in {seconds}s",
			"wait.paused": "Paused · {seconds}s remaining",
			"wait.held": "Waiting until you answer",
			"wait.continued": "Work continued — you can still answer",
			"review.status": "Answered",
			"review.skipped": "This question was skipped.",
			"nav.prev": "Previous question",
			"nav.next": "Next question",
			"nav.minimize": "Collapse the question card",
			"nav.maximize": "Expand the question card",
			"nav.cancel": "Dismiss all questions",
			"nav.close": "Close the panel — reopen it from the tool call",
			"option.recommended": "Recommended",
			"custom.placeholder": "Type your answer",
			"action.skip": "Skip",
			"action.next": "Next",
			"submit": "Submit",
			"submitting": "Submitting…",
			"copy": "Copy",
			"copied": "Copied",
			"codeBlock.title": "Code block",
			"codeBlock.wrap": "Wrap lines",
			"codeBlock.unwrap": "Unwrap lines",
			"markdown.footnotes": "Footnotes",
			"supplement.placeholder.next": "Optional note for this choice; press Enter for the next question",
			"supplement.placeholder.last": "Optional note for this choice; press Enter to submit"
		};
		//#endregion
		//#region src/client/index.ts
		/** Required services: the Slot registry and the locale dictionary seat. */
		const inject = ["slots", "locale"];
		/** Dictionary namespace owned by this plugin. */
		const NS = "question-note";
		/** Chain election order: the official composer sits at the default 0. */
		const CHAIN_PRIORITY = -10;
		/**
		* Client plugin body: register the dictionaries and the enhanced composer.
		* @param ctx - client root context.
		*/
		function apply(ctx) {
			ctx.effect(() => ctx.locale.register(NS, {
				zh,
				en
			}), "dsh-question-note: dictionaries");
			const questionNoteDraftStore = createQuestionNoteDraftStore();
			ctx.effect(() => ctx.slots.inject("conversation.composer", () => ctx.slots.register({
				name: "conversation.composer",
				priority: CHAIN_PRIORITY,
				select: selectQuestionCarrier,
				locale: NS,
				store: questionNoteDraftStore
			}, QuestionNoteComposer)), "dsh-question-note: composer");
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map