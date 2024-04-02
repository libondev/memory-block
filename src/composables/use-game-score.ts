import type { GameLevel, LEVEL_GRIDS } from '@/config/game'

export function useGameScore({ rate: multiplier }: typeof LEVEL_GRIDS[GameLevel]) {
  const BASIC_GAME_RATE = 10

  const timestamp = shallowRef(0)
  const gameScore = shallowRef(0)
  const deltaScore = shallowRef(0)

  let lastTimestamp = 0
  let timestampId = -1

  function setGameScore(counts: number) {
    stopRecording()
    const deltaTime = performance.now() - lastTimestamp

    // 时间每过 5 秒倍率 -1, 直到倍率为 1
    const timeScoreRate = Math.max(BASIC_GAME_RATE - Math.floor(deltaTime / 5000), 1)

    // 计分公式: 方块数量 * 难度倍率 * 时间倍率
    deltaScore.value = Math.round(counts * multiplier * timeScoreRate)

    gameScore.value += deltaScore.value
  }

  /**
   * 开始记录时间
   * @param lastTime 上次记录的时间, 用于恢复
   */
  function startRecording(lastTime: number = 0) {
    timestamp.value = lastTime
    lastTimestamp = performance.now()

    timestampId = window.setInterval(() => {
      timestamp.value += 1
    }, 1000)
  }

  function stopRecording() {
    clearInterval(timestampId)
  }

  // 当页面不可见时停止计时
  function onVisibilityChange() {
    if (document.visibilityState === 'hidden') {
      stopRecording()
    } else {
      startRecording(timestamp.value)
    }
  }

  document.addEventListener('visibilitychange', onVisibilityChange)

  onBeforeUnmount(() => {
    stopRecording()

    document.removeEventListener('visibilitychange', onVisibilityChange)
  })

  return {
    timestamp,
    gameScore,
    deltaScore,
    setGameScore,
    stopRecording,
    startRecording,
  }
}
