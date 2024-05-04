// https://icones.js.org/collection/game-icons

export const GAME_GOODS = [
  {
    id: 'REGENERATE',
    name: '重新开始',
    icon: 'i-game-icons-perspective-dice-six-faces-random',
    description: '说不上来为什么，但总感觉哪里不对劲（重新生成方块数量及位置）',
    color: 'text-orange-600',
    discountPrice: 0.5,
    price: 300,
    count: 0,
  },
  {
    id: 'IGNORE_ERROR',
    name: '走个后门',
    icon: 'i-game-icons-broken-shield',
    description: '尽情犯错吧，但这可不是长久之计（可以选择任意方块作为结果）',
    color: 'text-teal-600',
    discountPrice: 0.5,
    price: 300,
    count: 0,
  },
  {
    id: 'LOOK_AGAIN',
    name: '再看一眼',
    icon: 'i-game-icons-brain',
    description: '刚刚发生了什么？（回到预览阶段重新开始本回合）',
    color: 'text-indigo-600',
    discountPrice: 0.5,
    price: 150,
    count: 0,
  },
  {
    id: 'RESTORE_LIFE',
    name: '打个补丁',
    icon: 'i-game-icons-arm-bandage',
    description: '休息一下，做些你想做的事（回复 1 点生命值）',
    color: 'text-sky-600',
    discountPrice: 0.5,
    price: 150,
    count: 0,
  },
]

export type GameGood = typeof GAME_GOODS[number]
