import { type GameLevel, LEVEL_GRIDS } from '@/config/game'

import { getHighestScoreInHistory } from '@/composables/use-local-cache'

// 游戏核心状态管理，分数、生命值、目标方块等
export function useGameStatus() {
  const route = useRoute()
  const router = useRouter()

  const { level, levelConfig } = (() => {
    // 获取当前游戏配置
    const level = route.params.level as GameLevel || 'easy'
    let levelConfig = LEVEL_GRIDS[level]

    // 如果是自定义模式
    if (level === 'custom') {
      const localCustomLevel = localStorage.getItem('customLevelConfig')

      if (localCustomLevel) {
        levelConfig = JSON.parse(localCustomLevel)
      } else {
        router.replace('/settings/custom')
        useToastError('请先设置自定义模式')
      }
    }

    return {
      level,
      levelConfig,
    }
  })()

  // 需要选中的方块
  const targetBlocks = shallowRef(new Set<string>())

  // 当前生命值
  const gameHealth = shallowRef(levelConfig.health)
  const gameHealthList = computed(() => Array.from({ length: levelConfig.health + 1 }, (_, i) => i))

  const highestScore = shallowRef(0)
  const showHighestScoreBadge = shallowRef(false)

  // 更新历史最高分状态
  function updateHighestScoreStatus() {
    showHighestScoreBadge.value = false

    getHighestScoreInHistory(level).then((v) => {
    // 更新历史最高分
      highestScore.value = v || 0
    })
  }

  // 生成目标方块
  function generateRandomTargetBlock() {
    const { min, max, grid } = levelConfig

    const target = new Set<string>()
    // 生成随机数量
    const counts = Math.floor(Math.random() * (max - min + 1)) + min

    // 如果生成的数量不够则继续生成
    while (target.size < counts) {
      const row = Math.floor(Math.random() * grid)
      const col = Math.floor(Math.random() * grid)

      target.add(`${row},${col}`)
    }

    targetBlocks.value = target
  }

  return {
    level,
    gameHealth,
    levelConfig,
    targetBlocks,
    highestScore,
    gameHealthList,
    showHighestScoreBadge,

    updateHighestScoreStatus,
    generateRandomTargetBlock,
  }
}
