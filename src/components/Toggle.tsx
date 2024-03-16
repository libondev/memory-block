interface ToggleProps extends Props {

  className?: string
  color: string
  defaultChecked?: boolean
}

export function Toggle({
  className = 'size-8',
  color,
  children,
  ...rest
}: ToggleProps) {
  return (
    <label className={cls('block select-none', color, className)}>
      <input type="checkbox" className="peer hidden" {...rest} />
      <i className="inline-block w-full h-full rounded-lg transition-all text-white dark:text-black bg-current border-[rgba(0,0,0,.2)] peer-checked:text-inherit peer-checked:bg-current peer-checked:shadow-[0_0_8px_currentColor]">{ children }</i>
    </label>
  )
}
