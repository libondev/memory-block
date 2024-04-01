<script lang="ts" setup>
import confetti from 'canvas-confetti'

import { LEVEL_GRIDS, type Level } from '@/config/game'

import { useGameScope } from '@/composables/use-game-scope'
import { useCheckedBlocks } from '@/composables/use-checked-blocks'

const level = useRoute().params.level as Level || 'easy'
const levelConfig = LEVEL_GRIDS[level] || LEVEL_GRIDS.easy

const isGameOver = shallowRef(false)
const isGamePause = shallowRef(false)
const isPreviewMode = shallowRef(true)
const getScopeVisible = shallowRef(false)

const gameHealth = shallowRef(levelConfig.health)
const checkedNumber = shallowRef(0)

// 生成随机高亮的块
const targetBlocks = shallowRef(new Set<string>())

const {
  over: playOver,
  error: playError,
  success: playSuccess,
} = useGameSounds()

const {
  timestamp,
  gameScope,
  deltaScope,
  startScoring,
  setGameScope,
  stopTimestamp,
} = useGameScope(levelConfig)

const {
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

function startGame() {
  resetCountdown()
  startCountdown()

  checkedNumber.value = 0
  isGamePause.value = false
  isPreviewMode.value = true
  targetBlocks.value = generateRandomTarget(levelConfig)

  // 重置所有错误块的选中
  uncheckAllBlocks()
  uncheckMissBlocks()
  uncheckWrongBlocks()
  checkedTargetBlock()

  clearTimeout(startTimeoutId)
  // 延迟关闭预览模式
  startTimeoutId = window.setTimeout(() => {
    // 开始计时计分
    startScoring()
    uncheckAllBlocks()
    isPreviewMode.value = false
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
    getScopeVisible.value = true
    setGameScope(targetBlocks.value.size)
    startGame()
    playSuccess()

    return
  }

  // 如果上一步是选错的
  if (isGamePause.value) {
    startGame()
    return
  }

  // 如果还有生命值
  if (gameHealth.value > 0) {
    stopTimestamp()
    markAllMissBlocks()
    markAllWrongBlocks()

    playError()
    gameHealth.value--

    if (gameHealth.value === 0) {
      gameOver()
    } else {
      isGamePause.value = true
    }

    return
  }

  gameOver()
}

function gameOver() {
  stopTimestamp()
  markAllMissBlocks()
  markAllWrongBlocks()
  useToastError('游戏结束')
  isGameOver.value = true
  playOver()

  // 有分数才生成纸屑, 否则会有点嘲笑 0 分的意思:)
  // 游戏结束时, 分数越高, 生成越多的纸屑
  if (gameScope.value > 0) {
    confetti({
      // 根据分数生成纸屑数量
      particleCount: Math.max(gameScope.value, 100),
    })
  }
}

function onResetBlocks() {
  uncheckAllBlocks()
  checkedNumber.value = 0

  if (isGameOver.value) {
    gameScope.value = 0
    isGameOver.value = false
    gameHealth.value = levelConfig.health
    startGame()
  }
}

// 动画结束后隐藏
function onAnimationend() {
  getScopeVisible.value = false
}

function generateRandomTarget({ min, max, grid }: typeof LEVEL_GRIDS[Level]) {
  const target = new Set<string>()
  const count = Math.floor(Math.random() * (max - min + 1)) + min

  while (target.size < count) {
    const row = Math.floor(Math.random() * grid)
    const col = Math.floor(Math.random() * grid)

    target.add(`${row},${col}`)
  }

  return target
}

function handleCheckboxChange(e: Event) {
  const target = e.target as HTMLInputElement
  checkedNumber.value += target.checked ? 1 : (-1)
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
      <h2 className="w-full text-xl text-center">
        {{ isPreviewMode ? '请记住以下方块位置' : isGameOver ? '游戏结束' : '游戏开始' }}
        <span v-if="countdown" class="font-mono">({{ countdown }})</span>
      </h2>

      <div class="my-8 text-[40px] font-mono text-center">
        {{ gameScope }}

        <Transition name="increase-scope">
          <span
            v-show="getScopeVisible"
            class="absolute text-[60%] text-emerald-500 duration-500 animate-in fade-in slide-in-from-bottom"
            @animationend="onAnimationend"
          >+{{ deltaScope }}</span>
        </Transition>
      </div>

      <div class="flex mb-1 justify-between items-center text-lg font-mono">
        <span class="flex-1 flex items-center">
          <i class="i-solar-stop-bold text-emerald-500 mr-0.5 align-[-2.5px]" />
          {{ checkedNumber }}/{{ targetBlocks.size }}
        </span>

        <span class="flex-1 flex items-center justify-center">
          <i class="i-solar-health-bold text-xl text-red-500 mr-0.5 align-[-3px]" />
          {{ gameHealth }}
        </span>

        <span class="flex-1 flex items-center justify-end relation">
          <i class="i-solar-alarm-add-broken mr-0.5 align-[-2.5px]" />
          {{ timestamp }}s
        </span>
      </div>

      <GameGrid
        :config="levelConfig"
        :is-max="checkedNumber >= targetBlocks.size"
        :class="{ 'pointer-events-none': isPreviewMode || isGameOver || isGamePause }"
        @change="handleCheckboxChange"
      />

      <div class="mt-12 mb-20  gap-4 flex justify-center">
        <Button
          :disabled="isPreviewMode || isGamePause"
          @click="onResetBlocks"
        >
          {{ isGameOver ? '再来一次' : '清空选中' }}
        </Button>

        <Button
          v-show="!isGameOver"
          :disabled="isPreviewMode"
          :type="isGamePause ? 'warning' : 'primary'"
          @click="onCheckResult"
        >
          {{ isGamePause ? '继续' : '选好了' }}
        </Button>
      </div>
    </div>
  </main>
</template>

<style scoped>
.increase-scope-enter-active,
.increase-scope-leave-active {
  transition: all 0.5s ease;
}

.increase-scope-enter-from,
.increase-scope-leave-to {
  opacity: 0;
}
</style>
