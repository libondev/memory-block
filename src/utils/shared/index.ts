/**
 * 生成一个随机的 UUID
 * @example
 * ```js
 * getUUID()
 * // -> '7982fcfe-5721-4632-bede-6000885be57d'
 * ```
 */
export function getUUID() {
  return (`${1e7}${-1e3}${-4e3}${-8e3}${-1e11}`).replace(/[018]/g, (c) => {
    return (Number(c) ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (Number(c) / 4)))).toString(16)
  })
}

/**
 * 复制文本到剪贴板
 */
export function copyToClipboard(string: string) {
  if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(string)
  }

  return Promise.reject(new Error('The Clipboard API is not available.'))
}

/**
 * 获取指定时间的 24 小时制时间
 * @example
 * ```js
 * getColonTimeFromDate(new Date()) // '08:38:00'
 * ```
 */
export const getDateTimeFromDate = (date: Date = new Date()) => date.toTimeString().slice(0, 8)

/**
 * 获取用户的系统是否为暗黑模式
 * @example
 * ```js
 * prefersDarkColorScheme() // true
 * ```
 */
export const prefersDarkColorScheme = () => window && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches

/**
 * 是否为空对象
 * @param object 要检测的对象
 */
export const isEmptyObject = (object: object) => Reflect.ownKeys(object).length === 0

// 千分位格式化分数
export function formatScore(score: number) {
  const numStr = score.toString()
  const reg = /\B(?=(\d{3})+(?!\d))/g
  return numStr.replace(reg, ',')
}

export const isMobile = 'ontouchstart' in window
