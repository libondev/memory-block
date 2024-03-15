type ButtonProps = Props & {
  as?: ReactNode
  type?: keyof typeof VARIANT
}

const VARIANT = {
  default: 'bg-white',
  danger: 'bg-red-500 text-white',
  warning: 'bg-orange-500 text-white',
  primary: 'bg-emerald-500 text-white',
}

export function Button({
  as: AS = 'button',
  type = 'default',
  className,
  children,
  ...args
}: ButtonProps) {
  return (
    <div className={cls('inline-block h-10', className)}>
      <AS
        className={cls(
          'inline-block select-none rounded-lg px-3 py-1.5 text-sm border-[rgba(0,0,0,.2)] border-x-[1.5px] border-t-[1.5px] border-b-4 active:border-b-[1.5px] active:translate-y-1',
          VARIANT[type],
        )}
        {...args}
      >
        {children}
      </AS>
    </div>
  )
}
