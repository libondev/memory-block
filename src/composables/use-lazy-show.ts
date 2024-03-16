interface Options {
  /**
   * 默认值, 初始情况下是否渲染
   */
  default?: boolean

  /**
   * 延迟时间, 单位毫秒, 在设置为隐藏后, 多少毫秒后才真正隐藏
   */
  delay?: number
}

interface ReturnType {
  /**
   * 用于 v-if, 控制元素是否渲染
   */
  render: Ref<boolean>

  /**
   * 用于 v-show, 控制元素是否可见
   */
  visible: Ref<boolean>

  /**
   * 渲染元素
   */
  open: () => void

  /**
   * 先隐藏元素, 在延迟结束后销毁元素(组件)
   */
  close: () => void
}

export function useLazyShow(valueOrOptions?: boolean): ReturnType
export function useLazyShow(valueOrOptions?: Options): ReturnType
export function useLazyShow(valueOrOptions: boolean | Options = {}): ReturnType {
  const {
    delay = 300,
    default: value = false,
  } = typeof valueOrOptions === 'boolean'
    ? { default: valueOrOptions, delay: 300 }
    : valueOrOptions

  const render = shallowRef(value)
  const visible = shallowRef(value)

  let delayTimeoutId = -1

  const open = () => {
    clearTimeout(delayTimeoutId)

    render.value = true

    Promise.resolve().then(() => {
      visible.value = true
    })
  }

  const close = () => {
    visible.value = false

    delayTimeoutId = window.setTimeout(() => {
      render.value = false
    }, delay)
  }

  return {
    open,
    close,
    render,
    visible,
  }
}
