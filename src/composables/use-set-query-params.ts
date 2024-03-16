interface Options {
  urlKey: string
  options: string[]
}

/**
 * 当从配置项中切换值得时候将值记录到 url 中
 */
export function useSetQueryParams<ValueType>({
  options,
  urlKey,
} = {} as Options) {
  const route = useRoute()

  const value = shallowRef(
    (route.query[urlKey] || options[0]) as ValueType,
  )

  const toggle = (mode: ValueType) => {
    value.value = mode

    // 如果设置了 urlKey 则表示需要将状态记录在 url
    if (!urlKey)
      return

    route.query[urlKey] = mode as string

    const newQueryString = new URLSearchParams(
      route.query as Record<string, string>,
    ).toString()

    // 如果有历史记录则更新历史记录, 如果不修改这个值而直接设置为 null
    // 在跳转页面的时候会出现一个 vue-router 的警告
    if (history.state)
      history.state.current = `${location.href.includes('#') ? '#' : ''}${route.path}?${newQueryString}`

    // 切换后在 url 上记录状态避免刷新后需要重新选择
    history.replaceState(history.state, '', history.state.current)
  }

  return {
    value,
    toggle,
  }
}
