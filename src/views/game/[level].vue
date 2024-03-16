<script lang="ts" setup>
import confetti from 'canvas-confetti'
import Button from '@/components/Button.vue'
import GameGrid from '@/components/GameGrid.vue'
import ToggleMode from '@/components/ToggleMode.vue'

import { LEVEL_GRIDS, type Level } from '@/config/game'

import { useGameScope } from '@/composables/use-game-scope'
import { useCheckedBlocks } from '@/composables/use-checked-blocks'

const level = useRoute().params.level as Level || 'easy'
const levelConfig = LEVEL_GRIDS[level] || LEVEL_GRIDS.easy

const isGameOver = shallowRef(false)
const isPreviewMode = shallowRef(true)
const getScopeVisible = shallowRef(false)

// 生成随机高亮的块
const targetBlocks = shallowRef(new Set<string>())

const {
  timestamp,
  gameScope,
  deltaScope,
  startScoring,
  setGameScope,
  clearTimestamp,
} = useGameScope(levelConfig)

const {
  uncheckAllBlocks,
  uncheckWrongBlocks,
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
  const result = getAllCheckedResult()

  if (result) {
    setGameScope(targetBlocks.value.size)

    getScopeVisible.value = true
    startGame()

    return
  }

  clearTimestamp()
  markAllWrongBlocks()
  checkedTargetBlock()
  useToastError('游戏结束')
  isGameOver.value = true

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
</script>

<template>
  <main class="h-full flex items-center justify-center">
    <div>
      <div class="flex justify-between items-center">
        <Button as="RouterLink" to="/">
          <i class="block i-solar-arrow-down-broken rotate-90" />
        </Button>

        <!-- <Button>
          <i class="block i-solar-volume-loud-broken" />
          <i class="block i-solar-volume-cross-broken" />
        </Button> -->

        <ToggleMode />
      </div>

      <h2 className="w-full text-xl text-center mt-6">
        {{ isPreviewMode ? '请记住以下方块位置' : '游戏开始' }}
        <span v-if="countdown" class="font-mono">({{ countdown }})</span>
      </h2>

      <div class="my-8 text-[40px] font-mono text-center">
        {{ gameScope }}

        <Transition name="increase-scope">
          <span
            v-show="getScopeVisible"
            class="absolute text-[80%] text-emerald-500 duration-500 animate-in fade-in slide-in-from-bottom"
            @animationend="onAnimationend"
          >+{{ deltaScope }}</span>
        </Transition>
      </div>

      <div class="flex mb-2 justify-between items-center text-lg font-mono">
        <span>
          <i class="i-solar-stop-broken -mr-1.5 align-[-2.5px]" />
          {{ targetBlocks.size }}
        </span>

        <span class="relation text-right">
          <i class="i-solar-alarm-add-broken -mr-2 align-[-2.5px]" />
          {{ timestamp }}s
        </span>
      </div>

      <GameGrid
        :config="levelConfig"
        :blocks="targetBlocks"
        :preview="isPreviewMode"
        :class="{ 'pointer-events-none': isPreviewMode || isGameOver }"
      />

      <div class="mt-12 mb-20  gap-4 flex justify-center">
        <Button :disabled="isPreviewMode" @click="onResetBlocks">
          {{ isGameOver ? '再来一次' : '重选' }}
        </Button>

        <Button v-if="!isGameOver" :disabled="isPreviewMode" type="primary" @click="onCheckResult">
          检查
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
