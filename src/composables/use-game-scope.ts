import type { LEVEL_GRIDS, Level } from '@/config/game'

export function useGameScope({ rate: multiplier }: typeof LEVEL_GRIDS[Level]) {
  const BASIC_GAME_RATE = 10

  const gameScope = shallowRef(0)
  const deltaScope = shallowRef(0)
  const timestamp = shallowRef(0)

  let lastTimestamp = 0
  let timestampId = -1

  /**
   * 开始记录时间
   */
  function startScoring() {
    timestamp.value = 0
    lastTimestamp = performance.now()

    timestampId = window.setInterval(() => {
      timestamp.value += 1
    }, 1000)
  }

  function setGameScope(counts: number) {
    stopTimestamp()
    const deltaTime = performance.now() - lastTimestamp

    // 时间每过 5 秒倍率 -1, 直到倍率为 1
    const finalScopeRate = Math.max(BASIC_GAME_RATE - Math.floor(deltaTime / 5000), 1)

    // 计分公式: 方块数量 * 难度倍率 * 时间倍率
    deltaScope.value = Math.round(counts * multiplier * finalScopeRate)

    gameScope.value += deltaScope.value
  }

  function stopTimestamp() {
    clearInterval(timestampId)
  }

  return {
    timestamp,
    gameScope,
    deltaScope,
    startScoring,
    setGameScope,
    stopTimestamp,
  }
}
