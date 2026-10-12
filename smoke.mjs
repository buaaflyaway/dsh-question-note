// Smoke test: load the built browser bundle with a stubbed module loader and
// verify it registers a callable apply/inject pair. Run: node smoke.mjs
import { readFileSync } from 'node:fs'

const code = readFileSync(new URL('./lib/client.js', import.meta.url), 'utf8')

let registration
globalThis.window = {
  __ModuleLoader__: {
    load(entry) { registration = entry },
  },
}

// Any bare specifier the factory requires resolves to a permissive stub; the
// module-level code only stores references, and rendering never happens here.
const stubTarget = () => new Proxy(function () {}, {
  get: (_target, prop) => (prop === 'then' ? undefined : stubTarget()),
  apply: () => stubTarget(),
  construct: () => stubTarget(),
})
const requireStub = (specifier) => {
  if (!['react', 'react/jsx-runtime', 'react-dom', 'react-dom/client',
    '@deepseek-ai/cordis', '@deepseek-ai/dsh-client-store',
    '@deepseek-ai/dsh-client-ui-slots', '@deepseek-ai/dsh-client-ui-primitives',
    '@deepseek-ai/dsh-client-ui-dockkit'].includes(specifier)) {
    throw new Error(`unexpected require: ${specifier}`)
  }
  return stubTarget()
}

new Function('window', code)(globalThis.window)
if (registration === undefined) throw new Error('bundle did not call __ModuleLoader__.load')
if (registration.id !== 'dsh-question-note') throw new Error(`wrong id: ${String(registration.id)}`)
const exportsObject = registration.factory(requireStub)
if (typeof exportsObject.apply !== 'function') throw new Error('exports.apply is not a function')
if (!Array.isArray(exportsObject.inject)) throw new Error('exports.inject is not an array')
console.log(`SMOKE OK: id=${registration.id} inject=${JSON.stringify(exportsObject.inject)} apply=fn`)
