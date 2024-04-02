export const GAME_LEVELS = {
  easy: { code: 'easy', type: 'default', en: 'Easy Level', zh: '简单难度', path: '/game/easy' },
  normal: { code: 'normal', type: 'primary', en: 'Normal Level', zh: '中等难度', path: '/game/normal' },
  master: { code: 'master', type: 'warning', en: 'Master Level', zh: '困难难度', path: '/game/master' },
  expert: { code: 'expert', type: 'danger', en: 'Expert Level', zh: '专家难度', path: '/game/expert' },
  // custom: { code: 'custom', type: 'custom', en: 'Practice Mode', zh: '练习模式', path: '/game/expert' },
} as const

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
    internal: 2,
    size: 'size-10',
  },

  expert: {
    grid: 9,
    min: 10,
    max: 15,
    rate: 1.8,
    health: 2,
    internal: 2,
    size: 'size-8',
  },
} as const

export type GameLevel = {
  [K in keyof typeof GAME_LEVELS]: typeof GAME_LEVELS[K]['code'];
}[keyof typeof GAME_LEVELS]
