export const COLORS = {
  easy: 'bg-white dark:bg-gray-700',
  expert: 'bg-red-500 dark:bg-red-500 text-white',
  master: 'bg-orange-500 dark:bg-orange-600 text-white',
  normal: 'bg-emerald-500 dark:bg-emerald-600 text-white',
  custom: 'bg-violet-500 dark:bg-violet-500 text-white',
}

export const VARIANT = {
  default: COLORS.easy,
  danger: COLORS.expert,
  warning: COLORS.master,
  primary: COLORS.normal,
  custom: COLORS.custom,
}
