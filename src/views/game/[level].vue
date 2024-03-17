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

// 生成随机高亮的块
const targetBlocks = shallowRef(new Set<string>())

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

    return
  }

  // 如果上一步是选错的
  if (isGamePause.value) {
    startGame()
    isGamePause.value = false
    return
  }

  // 如果还有生命值
  if (gameHealth.value > 0) {
    stopTimestamp()
    markAllMissBlocks()
    markAllWrongBlocks()

    gameHealth.value--
    isGamePause.value = true

    return
  }

  stopTimestamp()
  markAllMissBlocks()
  markAllWrongBlocks()
  useToastError('游戏结束')
  isGameOver.value = true

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

  if (isGameOver.value) {
    gameScope.value = 0
    isGameOver.value = false
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
        {{ isPreviewMode ? '请记住以下方块位置' : '游戏开始' }}
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

      <div class="flex mb-2 justify-between items-center text-lg font-mono">
        <span class="flex-1">
          <i class="i-solar-stop-bold text-emerald-500 -mr-2 align-[-2.5px]" />
          {{ targetBlocks.size }}
        </span>

        <span class="flex-1 text-center">
          <i class="i-solar-health-bold text-xl text-red-500 -mr-2 align-[-3px]" />
          {{ gameHealth }}
        </span>

        <span class="flex-1 relation text-right">
          <i class="i-solar-alarm-add-broken -mr-2 align-[-2.5px]" />
          {{ timestamp }}s
        </span>
      </div>

      <GameGrid
        :config="levelConfig"
        :class="{ 'pointer-events-none': isPreviewMode || isGameOver || isGamePause }"
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
          {{ isGamePause ? '确认结果' : '确定选择' }}
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
