type ButtonProps = Props & {
  type?: 'default' | 'primary'
}

const VARIANT = {
  default: 'bg-white',
  primary: 'bg-emerald-500 text-white',
}

export function Button({
  type = 'default',
  children,
  ...args
}: ButtonProps) {
  return (
    <button
      className={cls(
        'rounded-lg px-3 py-1.5 text-sm border-[rgba(0,0,0,.2)] border-x-[1.5px] border-t-[1.5px] border-b-4 active:border-b-[1.5px] active:translate-y-0.5',
        VARIANT[type],
      )}
      {...args}
    >
      {children}
    </button>
  )
}
