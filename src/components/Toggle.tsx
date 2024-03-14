interface ToggleProps {
  color: string
}

export function Toggle({
  color,
  ...rest
}: ToggleProps) {
  return (
    <label className={cls('select-none', color)}>
      <input type="checkbox" className="peer hidden" {...rest} />
      <i className="inline-block w-8 h-8 rounded-md bg-current border-[rgba(0,0,0,.2)] border-x-[1.5px] border-t-[1.5px] border-b-4 text-white peer-checked:text-inherit peer-checked:border-b-[1.5px] peer-checked:translate-y-0.5" />
    </label>
  )
}
