export const LEVEL_BUTTONS = [
  { type: 'default', en: 'Easy Level', zh: '简单难度', path: '/game/easy' },
  { type: 'primary', en: 'Normal Level', zh: '中等难度', path: '/game/normal' },
  { type: 'warning', en: 'Master Level', zh: '困难难度', path: '/game/master' },
  { type: 'danger', en: 'Expert Level', zh: '专家难度', path: '/game/expert' },
  // { type: 'custom', en: 'Practice Mode', zh: '练习模式', path: '/game/expert' },
] as const

export const LEVEL_GRIDS = {
  easy: {
    grid: 4,
    min: 2,
    max: 4,
    rate: 1,
    health: 3,
    internal: 2,
    size: 'size-12',
  },

  normal: {
    grid: 5,
    min: 5,
    max: 9,
    rate: 1.2,
    health: 3,
    internal: 3,
    size: 'size-11',
  },

  master: {
    grid: 7,
    min: 8,
    max: 12,
    rate: 1.5,
    health: 2,
    internal: 3,
    size: 'size-10',
  },

  expert: {
    grid: 9,
    min: 10,
    max: 15,
    rate: 1.8,
    health: 2,
    internal: 3,
    size: 'size-8',
  },
} as const

export type Level = keyof typeof LEVEL_GRIDS
