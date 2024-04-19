// https://icones.js.org/collection/game-icons

export const GAME_GOODS = [
  {
    id: 'regenerate',
    name: '再来一次',
    icon: 'i-game-icons-perspective-dice-six-faces-random',
    description: '说不上来为什么，但总感觉哪里不对劲（重新生成方块数量及位置）',
    color: 'text-orange-600',
    price: 300,
    count: 0,
  },
  {
    id: 'ignoreError',
    name: '走个后门',
    icon: 'i-game-icons-broken-shield',
    description: '尽情犯错吧，但这可不是长久之计（可以选择任意方块作为结果）',
    color: 'text-teal-600',
    price: 500,
    count: 0,
  },
  {
    id: 'lookAgain',
    name: '再看一遍',
    icon: 'i-game-icons-brain',
    description: '刚刚发生了什么？（增加 5 秒预览时间【仅在预览模式可用】）',
    color: 'text-indigo-600',
    price: 500,
    count: 0,
  },
  {
    id: 'restoreLife',
    name: '打个补丁',
    icon: 'i-game-icons-arm-bandage',
    description: '休息一下，做些你想做的事（回复 1 点生命值）',
    color: 'text-sky-600',
    price: 300,
    count: 0,
  },
]

export type GameGood = typeof GAME_GOODS[number]
