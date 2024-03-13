export function toArray(value: any) {
  if (!value)
    return []

  if (Array.isArray(value))
    return value

  return [value]
}
