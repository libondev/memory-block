import type { GameLevel, LEVEL_GRIDS } from '@/config/game'
import { getGameMoney, getHighestScoreInHistory } from '@/composables/use-local-cache'

export function useGameScore(
  { rate: multiplier }: typeof LEVEL_GRIDS[GameLevel],
  blocks: Ref<Set<string>>,
) {
  const BASIC_GAME_RATE = 10

  const timestamp = shallowRef(0)
  const gameScore = shallowRef(0)
  const gameMoney = shallowRef(0)

  const highestScore = shallowRef(0)
  const showHighestScoreBadge = shallowRef(false)

  let lastTimestamp = 0
  let timestampId = -1

  function setGameScore() {
    stopRecording()
    const deltaTime = performance.now() - lastTimestamp

    // 时间每过 5 秒倍率 -1, 直到倍率为 1
    const timeScoreRate = Math.max(BASIC_GAME_RATE - Math.floor(deltaTime / 5000), 1)

    // 计分公式: 方块数量 * 难度倍率 * 时间倍率
    const deltaScore = Math.round(blocks.value.size * multiplier * timeScoreRate)

    gameScore.value += deltaScore
  }

  /**
   * 开始记录时间
   * @param lastTime 上次记录的时间, 用于恢复
   */
  function startRecording(lastTime: number = 0) {
    timestamp.value = lastTime
    lastTimestamp = performance.now()

    stopRecording()
    timestampId = window.setInterval(() => {
      timestamp.value += 1
    }, 1000)
  }

  function stopRecording() {
    clearInterval(timestampId)
  }

  // 更新历史最高分状态
  function updateHighestScoreStatus(level: GameLevel) {
    getHighestScoreInHistory(level).then((v) => {
      // 更新历史最高分
      highestScore.value = v || 0
    })

    getGameMoney().then((money) => {
      gameMoney.value = money || 0
    })
  }

  return {
    timestamp,
    gameScore,
    gameMoney,
    highestScore,
    showHighestScoreBadge,

    setGameScore,
    stopRecording,
    startRecording,
    updateHighestScoreStatus,
  }
}
