import '@/styles/toast.scss'

interface ToastOptions {
  type?: 'warning' | 'success' | 'error'
  durations?: number
}

let Toaster: HTMLElement

export function initToast(): HTMLElement {
  const id = 'toaster'
  const tagName = 'section'
  const className = 'toast-container'
  const toaster = Toaster || document.querySelector(`#${id}.${className}`) as HTMLElement

  if (toaster)
    return toaster

  Toaster = Object.assign(
    document.createElement(tagName),
    { className, id },
  )

  document.body.append(Toaster)

  return Toaster
}

// https://aerotwist.com/blog/flip-your-animations/
// flip: First Last Invert Play
function flipToast(toast: HTMLOutputElement): void {
  // First: 获取初始高度
  const initialHeight = Toaster.offsetHeight

  // 添加子元素让容器高度变化
  Toaster.appendChild(toast)

  // Last: 再次获取容器高度
  const changedHeight = Toaster.offsetHeight

  // PLAY: 开始动画
  const animation = Toaster.animate([
    // Invert: 两者相减得到需要移动的距离
    { transform: `translateY(${changedHeight - initialHeight}px)` },
    { transform: 'translateY(0)' },
  ], { duration: 150, easing: 'ease-out' })

  animation.startTime = document.timeline.currentTime
}

function addToast(toast: HTMLOutputElement): void {
  const { matches: motionOK } = window.matchMedia(
    '(prefers-reduced-motion: no-preference)',
  )

  Toaster.children.length && motionOK
    ? flipToast(toast)
    : Toaster.appendChild(toast)
}

export function useToast(htmlText: string, { type, durations = 2000 } = {} as ToastOptions): void {
  const toast = Object.assign(document.createElement('output'), {
    'aria-live': 'polite',
    'className': `use-toast ${type ?? ''}`,
    'innerHTML': htmlText,
    'role': 'status',
    'style': `--durations: ${durations}ms`,
  })

  addToast(toast)

  Promise.allSettled(toast.getAnimations()
    .map(async animation => await animation.finished))
    .then(() => Toaster.removeChild(toast))
}

export function useToastError(htmlText: string) {
  useToast(htmlText, { type: 'error' })
}
