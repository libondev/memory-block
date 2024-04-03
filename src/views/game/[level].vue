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

// 选中/取消方块时更新选中数量
function onCheckboxChange(e: Event) {
  const target = e.target as HTMLInputElement
  setCheckedNumber(checkedNumber.value += (target.checked ? 1 : -1))
}

// 千分位格式化分数
function formatScore(score: number) {
  const numStr = score.toString()
  const reg = /\B(?=(\d{3})+(?!\d))/g
  return numStr.replace(reg, ',')
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
      <h2 class="w-full flex items-center justify-center text-xl font-mono">
        {{ gameStatus.previewing ? '请记住以下方块位置' : gameStatus.over ? '游戏结束' : '游戏开始' }}<template v-if="countdown">
          ({{ countdown }})
        </template>
      </h2>

      <div class="mt-6 font-mono flex items-center justify-between leading-none gap-4 min-w-60">
        <div class="flex items-center h-8 px-2 rounded-full border border-input bg-slate-100 dark:bg-slate-800 min-w-[75px]">
          <i class="i-solar-stop-bold text-lg mr-1 text-emerald-500" />
          <span class="flex-1 text-center">{{ checkedNumber }}/{{ targetBlocks.size }}</span>
        </div>

        <div class="flex items-center h-8 px-2 rounded-full border border-input bg-slate-100 dark:bg-slate-800 min-w-[75px]">
          <i class="i-solar-clock-circle-bold-duotone text-lg mr-1 opacity-70" />
          <span class="flex-1 text-center">{{ timestamp }}s</span>
        </div>

        <div class="flex items-center h-8 px-2 rounded-full border border-input bg-slate-100 dark:bg-slate-800">
          <i class="i-solar-health-bold text-lg mr-1 text-red-500" />
          <div v-if="gameHealth <= 5" class="w-4 h-4 mx-auto overflow-hidden">
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
          <span v-else class="flex-1 text-center">{{ gameHealth >= 99 ? '99+' : gameHealth }}</span>
        </div>
      </div>

      <div class="mt-2 font-mono flex items-center justify-between leading-none gap-4 w-60">
        <div v-if="level !== 'custom'" class="flex items-center h-8 px-2 rounded-full border border-input bg-slate-100 dark:bg-slate-800 min-w-[75px]">
          <i class="i-solar-ranking-bold-duotone text-lg translate-y-[-1.5px] mr-1 opacity-70" />
          <span class="flex-1 text-center">{{ highestScore }}</span>
        </div>
      </div>

      <div class="relative mb-4 text-4xl text-center">
        <span class="z-10 font-medium">{{ formatScore(gameScore) }}</span>

        <span v-if="showHighestScoreBadge" class="absolute -translate-x-2 text-xs rotate-45 inline-block font-bold px-2 rounded-full border-2 border-red-500 text-red-500">BEST</span>

        <Transition name="increase-score">
          <span
            v-show="showDeltaScore"
            class="absolute text-[60%] text-emerald-500 duration-500 animate-in fade-in slide-in-from-bottom"
            @animationend="onEndHideDeltaScore"
          >+{{ deltaScore }}</span>
        </Transition>
      </div>

      <Grid
        :config="levelConfig"
        :is-max="checkedNumber >= targetBlocks.size"
        :class="gameStatus.playing ? 'playing' : 'pointer-events-none'"
        @change="onCheckboxChange"
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
          class="w-[72px]"
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
