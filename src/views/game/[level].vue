<script lang="ts" setup>
import confetti from 'canvas-confetti'

import { name } from '@/../package.json'

import { useGameStatus } from '@/composables/use-game-status'
import { useGameScore } from '@/composables/use-game-score'
import { useCheckedBlocks } from '@/composables/use-checked-blocks'
import {
  setGameMoney,
  setHighestScoreInHistory,
} from '@/composables/use-local-cache'
import { i18NInjectionKey } from '@/composables/use-i18n'

type GameStatus = 'over' | 'pause' | 'playing' | 'previewing'

const { $t } = inject(i18NInjectionKey)!

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
  gameHealthList,
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
  gameMoney,
  deltaScore,
  highestScore,
  showDeltaScore,
  showScoreBadge,
  setGameScore,
  stopRecording,
  startRecording,
  onEndHideDeltaScore,
  updateHighestScoreStatus,
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
  start: startPreviewCountdown,
  reset: resetPrewiewCountdown,
  pause: pausePreviewCountdown,
} = useCountdown({
  times: levelConfig.internal,
  // 当倒计时结束时开始游戏并
  onFinished: onFinishedPreviewCountdown,
})

// 当预览倒计时结束时开始游戏计分, 取消所有预览块, 并设置游戏状态
function onFinishedPreviewCountdown() {
  // 开始计分计时
  startRecording()
  uncheckAllBlocks()
  setGameStatus('playing')
}

// 开始游戏
function startGame() {
  generateRandomTargetBlock()
  updateHighestScoreStatus(level)

  // 重置所有错误块的选中
  uncheckAllBlocks()
  uncheckMissBlocks()
  uncheckWrongBlocks()
  checkedTargetBlock()

  // 设置游戏状态为预览模式
  setGameStatus('previewing')

  // 重置读秒并重新开始倒计时
  resetPrewiewCountdown()
  startPreviewCountdown()
}

// 检查游戏结果
function onCheckResult() {
  // 如果游戏已结束或者正在预览中
  if (gameStatus.value.over || gameStatus.value.previewing) {
    return
  }

  const { matched, blocks } = getAllCheckedResult()

  if (!matched && !blocks.length) {
    useToast($t('select-one-first', '请先选择至少一个方块'))
    return
  }

  // 如果匹配成功
  if (matched) {
    startGame()
    setGameScore()
    playSuccessSound()

    return
  }

  // 如果上一步是选错的, 那么游戏状态会被设置为暂停
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

  useToastError($t('game-over', '游戏结束'))

  setGameMoney(gameMoney.value += gameScore.value)

  // 如果分数比历史最高分高, 更新历史最高分, 并播放纸屑
  if (gameScore.value > highestScore.value) {
    showScoreBadge.value = true
    highestScore.value = gameScore.value

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

// 当浏览器游戏标签不可见时暂停计时
function onGameTabVisibilityChange() {
  if (document.visibilityState === 'hidden') {
    stopRecording()
    pausePreviewCountdown()
    return
  }

  // 可见时再重新开始读秒和预览模式的计时
  startRecording(timestamp.value)
  startPreviewCountdown()
}

// 当在当前页面刷新或退出的时候保存本地状态以便于恢复上次的状态
// 但是只保存游戏的分数、生命值和选中的方块的状态，重新进入后会重新进入预览模式
const savedLocalStatusKey = `${name}.fe.game-status.${level}`

// 从本地恢复游戏状态
function onRestoreLocalStatus() {
  const localCache = localStorage.getItem(savedLocalStatusKey)

  if (!localCache) {
    return
  }

  try {
    const { _score, _health, _blocks } = JSON.parse(localCache)

    gameScore.value = _score
    gameHealth.value = _health
    targetBlocks.value = new Set(_blocks)

    uncheckAllBlocks()
    checkedTargetBlock()

    // 恢复后进入预览模式, 重新开始读秒，主要是需要恢复分数和血量
    setGameStatus('previewing')
    resetPrewiewCountdown()
    startPreviewCountdown()

    // 恢复后删除本地缓存
    localStorage.removeItem(savedLocalStatusKey)
  } catch (e) { }
}

// 保存游戏状态到本地
function onPageHideSaveLocalStatus() {
  // 保存游戏状态
  localStorage.setItem(savedLocalStatusKey, JSON.stringify({
    _score: gameScore.value,
    _health: gameHealth.value,
    _blocks: [...targetBlocks.value],
  }))
}

// PC 端监听键盘按下事件
function onBoardKeyDown({ code }: KeyboardEvent) {
  const KEY_EVENTS_MAP = {
    Enter: onCheckResult,
    Delete: onResetBlocks,
  } as const

  KEY_EVENTS_MAP[code as keyof typeof KEY_EVENTS_MAP]?.()
}

onMounted(() => {
  startGame()
  onRestoreLocalStatus()

  // 非移动端增加键盘事件
  if (!window.ontouchstart) {
    document.addEventListener('keydown', onBoardKeyDown)
  }

  document.addEventListener('visibilitychange', onGameTabVisibilityChange)
  window.addEventListener('pagehide', onPageHideSaveLocalStatus, { once: true })
})

onBeforeUnmount(() => {
  stopRecording()

  if (!window.ontouchstart) {
    document.removeEventListener('keydown', onBoardKeyDown)
  }

  // 如果是退出了当前页面再刷新的则不保存状态
  window.removeEventListener('pagehide', onPageHideSaveLocalStatus)
  document.removeEventListener('visibilitychange', onGameTabVisibilityChange)
})
</script>

<template>
  <main class="h-full flex items-center justify-center">
    <div>
      <h2 class="w-full flex items-center justify-center text-xl font-mono">
        {{ gameStatus.previewing ? $t('remember-block-locations', '请记住以下方块位置') : gameStatus.over ? $t('game-over', '游戏结束') : $t('start', '游戏开始') }}<template v-if="countdown">
          ({{ countdown }})
        </template>
      </h2>

      <div class="mx-auto my-4 font-mono flex flex-wrap items-center justify-center leading-none gap-2 max-w-96">
        <div class="flex items-center h-8 px-2 rounded-full border border-input bg-slate-100 dark:bg-slate-800 min-w-[75px]">
          <i class="i-solar-stop-bold text-lg mr-1 text-emerald-500" />
          <span class="flex-1 text-center">{{ checkedNumber }}/{{ targetBlocks.size }}</span>
        </div>

        <div class="flex items-center h-8 px-2 rounded-full border border-input bg-slate-100 dark:bg-slate-800 min-w-[75px]">
          <i class="i-solar-clock-circle-bold-duotone text-lg mr-1 opacity-70" />
          <span class="flex-1 text-center">{{ timestamp }}</span>
        </div>

        <div class="flex items-center h-8 px-2 pt-0.5 rounded-full border border-input bg-slate-100 dark:bg-slate-800">
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

        <!-- 练习模式不展示最高分字段/也不记录积分 -->
        <template v-if="level !== 'custom'">
          <!-- 积分货币 -->
          <div class="flex items-center h-8 px-2 rounded-full border border-input bg-slate-100 dark:bg-slate-800 min-w-[75px]">
            <i class="i-solar-chat-round-money-bold text-lg mr-1 text-yellow-400" />
            <span class="flex-1 text-center max-w-80 truncate">{{ gameMoney }}</span>
          </div>

          <!-- 历史最高分 -->
          <div class="flex items-center h-8 px-2 rounded-full border border-input bg-slate-100 dark:bg-slate-800 min-w-[75px]">
            <i class="i-solar-ranking-bold-duotone text-lg mr-1 text-orange-400 translate-x-0.5" />
            <span class="flex-1 text-center max-w-80 truncate">{{ highestScore }}</span>
          </div>
        </template>
      </div>

      <div class="relative mb-4 text-5xl text-center">
        <span class="z-10 font-mono font-medium">{{ formatScore(gameScore) }}</span>

        <span v-if="showScoreBadge" class="absolute -translate-x-2 text-xs rotate-45 inline-block font-bold px-2 rounded-full border-2 border-red-500 text-red-500">BEST</span>

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

      <div class="mt-12 mb-20 gap-4 flex justify-center">
        <Button
          :disabled="gameStatus.previewing || gameStatus.pause"
          @click="onResetBlocks"
        >
          {{ gameStatus.over ? $t('again', '再来一次') : $t('clear', '清空选中') }}
        </Button>

        <Button
          v-show="!gameStatus.over"
          :disabled="gameStatus.previewing"
          :type="gameStatus.pause ? 'warning' : 'primary'"
          @click="onCheckResult"
        >
          {{ gameStatus.pause ? $t('continue', '继续') : $t('selected', '选好了') }}
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
