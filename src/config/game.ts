export const GAME_LEVELS = {
  easy: { code: 'easy', type: 'default', en: 'Easy Level', zh: '简单难度', ja: '簡単なレベル', path: '/game/easy' },
  normal: { code: 'normal', type: 'primary', en: 'Normal Level', zh: '中等难度', ja: '中レベル', path: '/game/normal' },
  master: { code: 'master', type: 'warning', en: 'Master Level', zh: '困难难度', ja: 'マスターレベル', path: '/game/master' },
  expert: { code: 'expert', type: 'danger', en: 'Expert Level', zh: '专家难度', ja: 'エキスパートレベル', path: '/game/expert' },
  custom: { code: 'custom', type: 'custom', en: 'Practice Mode', zh: '练习模式', ja: '練習モード', path: '/settings/custom' },
} as const

export const LEVEL_GRIDS = {
  easy: {
    grid: 4,
    min: 2,
    max: 4,
    rate: 1,
    health: 3,
    internal: 2,
    fillFull: false,
    size: 'size-12',
  },

  normal: {
    grid: 5,
    min: 5,
    max: 9,
    rate: 1.2,
    health: 3,
    internal: 3,
    fillFull: false,
    size: 'size-11',
  },

  master: {
    grid: 7,
    min: 8,
    max: 12,
    rate: 1.5,
    health: 2,
    internal: 2,
    fillFull: false,
    size: 'size-10',
  },

  expert: {
    grid: 9,
    min: 10,
    max: 15,
    rate: 1.8,
    health: 2,
    internal: 2,
    fillFull: false,
    size: 'size-8',
  },

  custom: {
    grid: 3,
    min: 1,
    max: 1,
    rate: 1,
    health: 1,
    internal: 2,
    fillFull: false,
    size: 'size-12',
  },
} as const

export type GameLevel = {
  [K in keyof typeof GAME_LEVELS]: typeof GAME_LEVELS[K]['code'];
}[keyof typeof GAME_LEVELS]

export const languages = [
  { label: '中文', value: 'zh-CN' },
  { label: 'English', value: 'en-US' },
  { label: '日本語', value: 'ja-JP' },
]
