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
import { formatScore, isMobile } from '@/utils/shared/index'
import type { GameGood } from '@/config/goods.ts'

type GameStatus = 'over' | 'pause' | 'playing' | 'previewing'

const { $t } = inject(i18NInjectionKey)!

// 移动端和PC端设置不同的宽度大小, 移动端最大宽度为屏幕宽度
const MAX_GAME_WIDTH = isMobile ? window.innerWidth : 450

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
  highestScore,
  showHighestScoreBadge,
  setGameScore,
  stopRecording,
  startRecording,
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

// 当前忽略错误的道具还有多少个正在生效
const ignoreErrorPropCounts = shallowRef(0)

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

  const { matched, blocks } = getAllCheckedResult(ignoreErrorPropCounts)

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
  markAllMissBlocks()
  markAllWrongBlocks()
  setGameStatus('over')
  useToastError($t('game-over', '游戏结束'))

  // 更新游戏积分
  setGameMoney(gameMoney.value += gameScore.value)

  // 如果分数比历史最高分高, 更新历史最高分, 并播放纸屑
  if (gameScore.value > highestScore.value) {
    showHighestScoreBadge.value = true
    highestScore.value = gameScore.value

    playOverSound()
    confetti({ spread: 120, particleCount: 300 })
    setHighestScoreInHistory(level, gameScore.value)
  } else {
    // 如果分数没有超过最高分则只播放失败的音效
    playFailSound()
  }
}

// 清空选中的方块或者重新开始
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
    const { _score, _timer, _health, _blocks, _ignoreError } = JSON.parse(localCache)

    // 取消预览时间
    countdown.value = 0
    gameScore.value = _score
    gameHealth.value = _health
    targetBlocks.value = new Set(_blocks)
    ignoreErrorPropCounts.value = Number(_ignoreError)

    uncheckAllBlocks()
    startRecording(_timer)
    pausePreviewCountdown()
    setGameStatus('playing')

    // 恢复后删除本地缓存
    localStorage.removeItem(savedLocalStatusKey)
  } catch (e) { }
}

// 保存游戏状态到本地
function onPageHideSaveLocalStatus() {
  // 保存游戏状态
  localStorage.setItem(savedLocalStatusKey, JSON.stringify({
    _timer: timestamp.value,
    _score: gameScore.value,
    _health: gameHealth.value,
    _blocks: [...targetBlocks.value],
    _ignoreError: ignoreErrorPropCounts.value,
  }))
}

// 根据当前屏幕大小设置游戏区域的缩放比例
function setGameGridScale() {
  // 这个设置只执行一次，重新声明一个 ref 保存 dom 代价有点太大了
  const elGrid = document.querySelector('.game-grid') as HTMLDivElement

  if (!elGrid) {
    return
  }

  const { width } = elGrid.getBoundingClientRect()

  if (width <= MAX_GAME_WIDTH) {
    return
  }

  // 计算缩放比例，将网格缩放到最大宽度 - 预设的游戏边距
  const scale = MAX_GAME_WIDTH / width

  elGrid.style.cssText = `height:${width * scale}px;transform:scale(${scale});transform-origin:${isMobile ? '0 0' : 'top center'}`
}

// 使用道具
function onUseProps({ id }: GameGood) {
  switch (id) {
    // 再来一次
    case 'REGENERATE':
      stopRecording()
      startGame()
      break

    // 忽略本次提交选择的错误
    case 'IGNORE_ERROR':
      ignoreErrorPropCounts.value += 1
      break

    // 再看一次
    case 'LOOK_AGAIN':
      stopRecording()
      // 暂停正计时
      // 回到预览阶段并开始预览的计时
      setGameStatus('previewing')
      // 先取消手动选择的
      uncheckAllBlocks()
      checkedTargetBlock()
      resetPrewiewCountdown()
      startPreviewCountdown()
      break

    // 恢复一点生命值
    case 'RESTORE_LIFE':
      gameHealth.value += 1
      break

    default:
      break
  }
}

onMounted(() => {
  startGame()
  setGameGridScale()
  onRestoreLocalStatus()

  document.addEventListener('visibilitychange', onGameTabVisibilityChange)
  window.addEventListener('pagehide', onPageHideSaveLocalStatus, { once: true })
})

onBeforeUnmount(() => {
  stopRecording()

  // 如果是退出了当前页面再刷新的则不保存状态
  window.removeEventListener('pagehide', onPageHideSaveLocalStatus)
  document.removeEventListener('visibilitychange', onGameTabVisibilityChange)
})
</script>

<template>
  <main class="pt-4 h-full flex items-center justify-center">
    <div>
      <h2 class="w-full flex items-center justify-center text-xl font-mono">
        {{ gameStatus.previewing ? $t('remember-block-locations', '请记住以下方块位置') : gameStatus.over ? $t('game-over', '游戏结束') : $t('start', '游戏开始')
        }}<template v-if="countdown">
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
          <span class="flex-1 text-center">{{ timestamp }}s</span>
        </div>

        <div class="flex items-center h-8 px-2 pt-0.5 rounded-full border border-input bg-slate-100 dark:bg-slate-800">
          <i class="i-solar-health-bold text-lg mr-1 text-red-500" />
          <div v-if="gameHealth <= 5" class="w-4 h-4 mx-auto overflow-hidden">
            <div class="w-4 transition-transform duration-300 ease-in translate-y-[var(--ty)]" :style="`--ty: ${-gameHealth}rem`">
              <span v-for="val of gameHealthList" :key="val" class="size-4 leading-none text-center block">
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
            <span class="flex-1 text-center max-w-80 truncate">{{ formatScore(gameMoney) }}</span>
          </div>

          <!-- 历史最高分 -->
          <div class="flex items-center h-8 px-2 rounded-full border border-input bg-slate-100 dark:bg-slate-800 min-w-[75px]">
            <i class="i-solar-ranking-bold-duotone text-lg mr-1 text-orange-400 translate-x-0.5" />
            <span class="flex-1 text-center max-w-80 truncate">{{ formatScore(highestScore) }}</span>
          </div>
        </template>
      </div>

      <Increase :value="gameScore" class="text-5xl mb-3 text-center">
        <span class="z-10 font-mono font-medium">{{ formatScore(gameScore) }}</span>

        <span
          v-if="showHighestScoreBadge"
          class="absolute -translate-x-2 text-xs rotate-45 inline-block font-bold px-2 rounded-full border-2 border-red-500 text-red-500"
        >BEST</span>
      </Increase>

      <div class="relative w-max mx-auto">
        <Grid
          :config="levelConfig"
          :is-max="checkedNumber >= targetBlocks.size"
          :class="gameStatus.playing ? 'playing' : 'pointer-events-none'"
          @change="onCheckboxChange"
        />

        <i v-if="ignoreErrorPropCounts > 0" class="i-game-icons-broken-shield text-teal-600 opacity-30 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[200px] pointer-events-none" />
      </div>

      <div class="mt-12 mb-20 gap-3 flex justify-center">
        <PropsBag v-show="!gameStatus.over" :disabled="gameStatus.previewing || gameStatus.pause" @use-props="onUseProps" />

        <Button :disabled="gameStatus.previewing || gameStatus.pause" @click="onResetBlocks">
          {{ gameStatus.over ? $t('again', '再来一次') : $t('clear', '清空选中') }}
        </Button>

        <Button v-show="!gameStatus.over" :disabled="gameStatus.previewing" :type="gameStatus.pause ? 'warning' : 'primary'" @click="onCheckResult">
          {{ gameStatus.pause ? $t('continue', '继续') : $t('selected', '选好了') }}
        </Button>
      </div>
    </div>
  </main>
</template>
