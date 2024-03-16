/// <reference types="vite/client" />
/// <reference types="vite-plugin-pages/client" />
/// <reference types="vite-plugin-vue-layouts/client" />

export { }

declare global {
  interface Document {
    startViewTransition?: (callback: () => Promise<void> | void) => {
      finished: Promise<void>
      updateCallbackDone: Promise<void>
      ready: Promise<void>
    }
  }

  interface MatcherResult<Value, Input = unknown> {
    input: Input
    state: {
      matched: boolean
      value: Value
    }
  }
}
