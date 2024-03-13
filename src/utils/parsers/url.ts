
/**
 * 判断是否为绝对路径
 */
export const isAbsoluteURL = (url: string) => /^[a-z][a-z0-9+.-]*:/.test(url)


/**
 * 解析目标 url 的参数为对象
 * @example
 * ```js
 * getURLParameters('http://url.com/page?name=Adam&surname=Smith')
 * // -> {name: 'Adam', surname: 'Smith'}
 * ```
 */
// 浏览器版本比较旧用这个
// export const getURLParameters = (url: string) =>
//   (url.match(/([^?=&]+)(=([^&]*))/g) || []).reduce(
//     (a, v) => (
//       (a[v.slice(0, v.indexOf('='))] = v.slice(v.indexOf('=') + 1)), a
//     ),
//     {} as Record<string, string>
//   )

// 浏览器版本比较新用这个
export function getURLParameters(url: string) {
  const entries = new URL(url).searchParams.entries()

  return Array.from(entries).reduce((acc, [key, value]) => {
    acc[key] = value
    return acc
  }, {} as Record<string, string>)
}
