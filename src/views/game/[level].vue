<script lang="ts" setup>
import confetti from 'canvas-confetti'

import { useGameStatus } from '@/composables/use-game-status'
import { useGameScore } from '@/composables/use-game-score'
import { useCheckedBlocks } from '@/composables/use-checked-blocks'
import { setHighestScoreInHistory } from '@/composables/use-local-cache'

type GameStatus = 'over' | 'pause' | 'playing' | 'previewing'

const _gameState = shallowRef<GameStatus>('previewing')

const gameStatus = computed(() => ({
  over: _gameState.value === 'over',
  pause: _gameState.value === 'pause',
  playing: _gameState.value === 'playing',
  previewing: _gameState.value === 'previewing',
}))

// 更新游戏内部状态
function setGameStatus(status: GameStatus) {
  _gameState.value = status
}

const {
  level,
  gameHealth,
  levelConfig,
  targetBlocks,
  highestScore,
  gameHealthList,
  showHighestScoreBadge,

  updateHighestScoreStatus,
  generateRandomTargetBlock,
} = useGameStatus()

const {
  fail: playFailSound,
  over: playOverSound,
  error: playErrorSound,
  success: playSuccessSound,
} = useGameSounds()

const {
  timestamp,
  gameScore,
  deltaScore,
  showDeltaScore,
  setGameScore,
  stopRecording,
  startRecording,
  onEndHideDeltaScore,
} = useGameScore(levelConfig, targetBlocks)

const {
  checkedNumber,
  setCheckedNumber,
  uncheckAllBlocks,
  uncheckWrongBlocks,
  uncheckMissBlocks,
  markAllMissBlocks,
  checkedTargetBlock,
  markAllWrongBlocks,
  getAllCheckedResult,
} = useCheckedBlocks(targetBlocks)

const {
  value: countdown,
  start: startCountdown,
  reset: resetCountdown,
} = useCountdown({ times: levelConfig.internal })

let startTimeoutId = -1

async function startGame() {
  resetCountdown()
  startCountdown()

  updateHighestScoreStatus()
  generateRandomTargetBlock()

  // 重置所有错误块的选中
  uncheckAllBlocks()
  uncheckMissBlocks()
  uncheckWrongBlocks()
  checkedTargetBlock()

  // 设置游戏状态为预览模式
  setGameStatus('previewing')

  clearTimeout(startTimeoutId)
  // 延迟关闭预览模式
  startTimeoutId = window.setTimeout(() => {
    // 开始计分计时
    startRecording()
    uncheckAllBlocks()
    setGameStatus('playing')
  }, levelConfig.internal * 1000)
}

function onCheckResult() {
  const { matched, blocks } = getAllCheckedResult()

  if (!matched && !blocks.length) {
    useToast('请先选择至少一个方块')
    return
  }

  // 如果匹配成功
  if (matched) {
    playSuccessSound()
    setGameScore()
    startGame()

    return
  }

  // 如果上一步是选错的
  if (gameStatus.value.pause) {
    startGame()
    return
  }

  // 如果还有生命值
  if (gameHealth.value > 0) {
    stopRecording()
    markAllMissBlocks()
    markAllWrongBlocks()

    playErrorSound()
    gameHealth.value--

    if (gameHealth.value === 0) {
      gameOver()
    } else {
      setGameStatus('pause')
    }

    return
  }

  gameOver()
}

function gameOver() {
  stopRecording()
  playFailSound()
  markAllMissBlocks()
  markAllWrongBlocks()
  setGameStatus('over')

  useToastError('游戏结束')

  // 如果分数比历史最高分高, 更新历史最高分, 并播放纸屑
  if (gameScore.value > highestScore.value) {
    highestScore.value = gameScore.value
    showHighestScoreBadge.value = true

    playOverSound()
    confetti({ spread: 120, particleCount: 300 })
    setHighestScoreInHistory(level, gameScore.value)
  }
}

function onResetBlocks() {
  uncheckAllBlocks()

  if (gameStatus.value.over) {
    gameScore.value = 0
    gameHealth.value = levelConfig.health
    startGame()
  }
}

function handleCheckboxChange(e: Event) {
  const target = e.target as HTMLInputElement
  setCheckedNumber(target.checked ? 1 : -1)
}

onMounted(() => {
  startGame()
})

onBeforeUnmount(() => {
  clearTimeout(startTimeoutId)
})
</script>

<template>
  <main class="h-full flex items-center justify-center">
    <div>
      <h2 className="w-full flex items-center justify-center text-xl font-mono">
        {{ gameStatus.previewing ? '请记住以下方块位置' : gameStatus.over ? '游戏结束' : '游戏开始' }}<template v-if="countdown">
          ({{ countdown }})
        </template>
      </h2>

      <div class="my-6 font-mono flex items-center w-60">
        <div class="flex flex-col text-lg w-24 min-w-20">
          <span class="flex items-center">
            <i class="i-solar-ranking-broken translate-y-[-1.5px] mr-0.5" />
            {{ highestScore }}
          </span>

          <span class="flex items-center">
            <i class="i-solar-stop-bold text-emerald-500 mr-0.5" />
            {{ checkedNumber }}/{{ targetBlocks.size }}
          </span>

          <span class="flex items-center">
            <i class="i-solar-alarm-add-broken mr-0.5" />
            {{ timestamp }}s
          </span>

          <span class="flex items-center">
            <i class="i-solar-health-bold text-red-500" />
            <div class="w-4 h-4 overflow-hidden">
              <div
                class="w-4 transition-transform duration-300 ease-in translate-y-[var(--ty)]"
                :style="`--ty: ${-gameHealth}rem`"
              >
                <span
                  v-for="val of gameHealthList"
                  :key="val"
                  class="size-4 leading-none text-center block"
                >
                  {{ val }}
                </span>
              </div>
            </div>
          </span>
        </div>

        <div class="relative flex-1 text-[40px] text-right">
          <span class="z-10 font-medium">{{ gameScore }}</span>

          <span v-if="showHighestScoreBadge" class="absolute -translate-x-2 text-xs rotate-45 inline-block font-bold px-2 rounded-full border-2 border-red-500 text-red-500">BEST</span>

          <Transition name="increase-score">
            <span
              v-show="showDeltaScore"
              class="absolute text-[60%] text-emerald-500 duration-500 animate-in fade-in slide-in-from-bottom"
              @animationend="onEndHideDeltaScore"
            >+{{ deltaScore }}</span>
          </Transition>
        </div>
      </div>

      <Grid
        :config="levelConfig"
        :is-max="checkedNumber >= targetBlocks.size"
        :class="gameStatus.playing ? 'playing' : 'pointer-events-none'"
        @change="handleCheckboxChange"
      />

      <div class="mt-12 mb-20  gap-4 flex justify-center">
        <Button
          :disabled="gameStatus.previewing || gameStatus.pause"
          @click="onResetBlocks"
        >
          {{ gameStatus.over ? '再来一次' : '清空选中' }}
        </Button>

        <Button
          v-show="!gameStatus.over"
          :disabled="gameStatus.previewing"
          :type="gameStatus.pause ? 'warning' : 'primary'"
          class="w-[70px]"
          @click="onCheckResult"
        >
          {{ gameStatus.pause ? '继续' : '选好了' }}
        </Button>
      </div>
    </div>
  </main>
</template>

<style>
.increase-score-enter-active,
.increase-score-leave-active {
  transition: all 0.5s ease;
}

.increase-score-enter-from,
.increase-score-leave-to {
  opacity: 0;
}
</style>
