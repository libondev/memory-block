import type { GameLevel, LEVEL_GRIDS } from '@/config/game'

export function useGameScore(
  { rate: multiplier }: typeof LEVEL_GRIDS[GameLevel],
  blocks: Ref<Set<string>>,
) {
  const BASIC_GAME_RATE = 10

  const timestamp = shallowRef(0)
  const gameScore = shallowRef(0)
  const deltaScore = shallowRef(0)
  const showDeltaScore = shallowRef(false)

  let lastTimestamp = 0
  let timestampId = -1

  function setGameScore() {
    stopRecording()
    const deltaTime = performance.now() - lastTimestamp

    // 时间每过 5 秒倍率 -1, 直到倍率为 1
    const timeScoreRate = Math.max(BASIC_GAME_RATE - Math.floor(deltaTime / 5000), 1)

    // 计分公式: 方块数量 * 难度倍率 * 时间倍率
    deltaScore.value = Math.round(blocks.value.size * multiplier * timeScoreRate)

    gameScore.value += deltaScore.value

    showDeltaScore.value = true
  }

  /**
   * 开始记录时间
   * @param lastTime 上次记录的时间, 用于恢复
   */
  function startRecording(lastTime: number = 0) {
    showDeltaScore.value = false

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

  function onEndHideDeltaScore() {
    showDeltaScore.value = false
  }

  return {
    timestamp,
    gameScore,
    deltaScore,
    showDeltaScore,
    setGameScore,
    stopRecording,
    startRecording,
    onEndHideDeltaScore,
  }
}
