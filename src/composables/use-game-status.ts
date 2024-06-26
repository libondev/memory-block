import { type GameLevel, LEVEL_GRIDS } from '@/config/game'

// 游戏核心状态管理，分数、生命值、目标方块等
export function useGameStatus() {
  const route = useRoute()

  const { level, levelConfig } = (() => {
    // 获取当前游戏配置
    const level = route.params.level as GameLevel || 'easy'
    let levelConfig = LEVEL_GRIDS[level]

    // 如果是自定义模式
    if (level === 'custom') {
      const localCustomLevel = localStorage.getItem('customLevelConfig')

      // 如果没设置就用预设的最简单的
      if (localCustomLevel) {
        levelConfig = JSON.parse(localCustomLevel)

        // 本地保存的配置可能会有问题，这里做一下合法性校验

        // 如果最小数量大于最大数量，交换两者
        if (levelConfig.min > levelConfig.max) {
          // @ts-expect-error let me do this!
          [levelConfig.min, levelConfig.max] = [levelConfig.max, levelConfig.min]
        }
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
  const gameHealthList = computed(() => Array.from({ length: levelConfig.health + gameHealth.value }, (_, i) => i))

  // 生成目标方块
  function generateRandomTargetBlock() {
    const { min, max, grid, fillFull } = levelConfig

    const target = new Set<string>()

    // 如果设置了【始终填满】则将所有格子高亮
    if (fillFull) {
      for (let x = 0; x < grid; x++) {
        for (let y = 0; y < grid; y++) {
          target.add(`${x},${y}`)
        }
      }
    } else {
      // 生成随机数量
      const counts = Math.floor(Math.random() * (max - min + 1)) + min

      // 如果生成的数量不够则继续生成
      while (target.size < counts) {
        const row = Math.floor(Math.random() * grid)
        const col = Math.floor(Math.random() * grid)

        target.add(`${row},${col}`)
      }
    }

    targetBlocks.value = target
  }

  return {
    level,
    gameHealth,
    levelConfig,
    targetBlocks,
    gameHealthList,
    generateRandomTargetBlock,
  }
}
