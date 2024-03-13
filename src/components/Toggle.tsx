interface ToggleProps {
  color: string
  pressed?: boolean
}

export function Toggle({
  pressed,
  ...args
}: ToggleProps) {
  return (
    <input
      type="checkbox"
      className={
        cls('inline-block w-8 h-8 border-[rgba(0,0,0,.2)] border-x-[1.5px] border-t-[1.5px] border-b-4', { 'border-b-[1.5px] translate-y-0.5': pressed })
      }
      {...args}
    />
  )
}
