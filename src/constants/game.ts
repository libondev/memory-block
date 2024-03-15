export const LEVEL_BUTTONS = [
    { type: 'default', en: 'Easy Level', zh: '简单难度', path: '/game/easy' },
    { type: 'primary', en: 'Middle Level', zh: '中等难度', path: '/game/middle' },
    { type: 'warning', en: 'Hard Level', zh: '困难难度', path: '/game/hard' },
    { type: 'danger', en: 'Hell Level', zh: '地狱难度', path: '/game/hell' },
  ] as const
  
  export const LEVEL_GRIDS = {
    easy: {
      grid: 4,
      min: 3,
      max: 5,
      internal: 5,
      size: 'size-12',
    },
  
    middle: {
      grid: 5,
      min: 5,
      max: 9,
      internal: 4,
      size: 'size-10',
    },
  
    hard: {
      grid: 6,
      min: 8,
      max: 12,
      internal: 3,
      size: 'size-10',
    },
  
    hell: {
      grid: 8,
      min: 10,
      max: 15,
      internal: 3,
      size: 'size-10',
    },
  } as const
  
  export type Level = keyof typeof LEVEL_GRIDS
  