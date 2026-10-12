//#region src/index.ts
/**
* Node half of dsh-question-note. The whole feature lives in the browser half
* (`./client`): it registers an enhanced question composer into the
* `conversation.composer` chain slot. This entry exists so the Loader has a
* host row to mount from the bundle patch.
*
* @module dsh-question-note
*/
/** Cordis plugin name of the host row. */
const name = "question-note";
/** No Cordis services are consumed on the host side. */
const inject = [];
/** Host half intentionally does nothing. */
function apply() {}
//#endregion
export { apply, inject, name };
