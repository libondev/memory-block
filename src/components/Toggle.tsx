interface ToggleProps {
  className?: string
  color: string
  defaultChecked?: boolean
}

export function Toggle({
  className = 'size-8',
  color,
  ...rest
}: ToggleProps) {
  return (
    <label className={cls('block select-none', color, className)}>
      <input type="checkbox" className="peer hidden" {...rest} />
      <i className="inline-block w-full h-full rounded-md bg-current border-[rgba(0,0,0,.2)] border border-b-4 text-white peer-checked:text-inherit peer-checked:border-b-[1px] peer-checked:translate-y-0.5" />
    </label>
  )
}
