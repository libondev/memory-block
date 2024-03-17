import { shallowRef } from 'vue'

interface Options {
  /**
   * 倒计时
   */
  times?: number

  /**
   * 倒数的间隔
   */
  interval?: number

  /**
   * 是否立即开始
   */
  immediate?: boolean

  /**
   * 当倒计时结束时
   */
  onEnd?: () => void
}

export function useCountdown({
  times = 60,
  interval = 1,
  immediate = false,
  onEnd = () => { },
} = {} as Options) {
  let timeoutId: number

  const remainder = shallowRef(0)

  function pause() {
    clearTimeout(timeoutId)
  }

  function start(manual = true) {
    if (manual && !remainder.value) {
      remainder.value = times
    }

    timeoutId = window.setTimeout(() => {
      remainder.value -= interval

      remainder.value ? start(false) : onEnd()
    }, interval * 1000)
  }

  function reset() {
    pause()
    remainder.value = times
  }

  immediate && start()

  onBeforeUnmount(() => {
    pause()
  })

  return {
    pause,
    reset,
    start,
    value: remainder,
  }
}
