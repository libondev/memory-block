<script lang="ts" setup>
import confetti from 'canvas-confetti'
import GameGrid from './components/Grid.vue'
import Button from '@/components/Button.vue'
import ToggleMode from '@/components/ToggleMode.vue'

import { LEVEL_GRIDS, type Level } from '@/config/game'

import {
  generateRandomTarget,
  getAllCheckedBlocks,
  matchAllCheckedResult,
  resetAllCheckedBlocks,
} from '@/utils/game/grid'

const level = useRoute().params.level as Level || 'easy'
const levelConfig = level in LEVEL_GRIDS ? LEVEL_GRIDS[level] : LEVEL_GRIDS.easy

const { value: timer, start, reset } = useCountdown({ times: levelConfig.internal })

const gameScope = shallowRef(0)
const isGameOver = shallowRef(false)
const isPreviewMode = shallowRef(true)

// 生成随机高亮的块
const targetBlocks = shallowRef(new Set<string>())

// 预览模式下高亮块
function setTargetBlocksActive() {
  targetBlocks.value.forEach((coordinate) => {
    const [row, col] = coordinate.split(',')
    const el = document.querySelector(`[data-row="${row}"][data-col="${col}"]`) as HTMLInputElement

    if (el)
      el.checked = true
  })
}

let timeoutId = -1
function setPreviewStatus() {
  reset()
  start()

  targetBlocks.value = generateRandomTarget(levelConfig)
  isPreviewMode.value = true
  setTargetBlocksActive()

  clearTimeout(timeoutId)

  timeoutId = window.setTimeout(() => {
    isPreviewMode.value = false
    resetAllCheckedBlocks()
  }, levelConfig.internal * 1000)
}

function onCheckCheckedResult() {
  const blocks = getAllCheckedBlocks()

  if (!blocks.length) {
    useToast('还没有勾选方块')
    return
  }

  const result = matchAllCheckedResult(targetBlocks.value)

  // 通过
  if (result) {
    gameScope.value += blocks.length * 10
    resetAllCheckedBlocks()
    setPreviewStatus()

    return
  }

  isGameOver.value = true
  useToastError('游戏结束')
  highlightWrongCheckedBlocks()

  if (gameScope.value > 0) {
    confetti({
      // 根据分数生成纸屑数量
      particleCount: Math.max(gameScope.value, 100),
    })
  }
}

// 高亮选错的元素
function highlightWrongCheckedBlocks() {
  const blocks = document.querySelectorAll<HTMLInputElement>('input[data-row][data-col]')

  const wrongBlocks = [] as HTMLElement[]

  blocks.forEach((block) => {
    const coordinate = `${block.dataset.row},${block.dataset.col}`

    if (targetBlocks.value.has(coordinate)) {
      block.checked = true
    } else if (block.checked) {
      const el = block.nextSibling as HTMLElement
      wrongBlocks.push(el)
      el.classList.add('!text-red-500', 'i-carbon-close')
    }
  })
}

function onResetBlocksOrRestartGame() {
  resetAllCheckedBlocks()

  if (isGameOver.value) {
    gameScope.value = 0
    isGameOver.value = false
    setPreviewStatus()
  }
}

onMounted(() => {
  setPreviewStatus()
})
</script>

<template>
  <main class="h-full flex items-center justify-center">
    <div>
      <div class="flex justify-between items-center">
        <Button as="RouterLink" to="/">
          <i class="block i-carbon-arrow-left" />
        </Button>

        <ToggleMode />
      </div>

      <strong class="mt-4 block w-full text-center text-5xl font-medium font-mono">{{ gameScope }}</strong>

      <h2 className="w-full text-xl text-center mt-6 mb-12">
        {{ isPreviewMode ? '请记住以下方块位置' : '游戏开始' }}
        <span v-if="timer" class="font-mono">({{ timer }})</span>
      </h2>

      <GameGrid
        :config="levelConfig"
        :blocks="targetBlocks"
        :preview="isPreviewMode"
        :class="{ 'pointer-events-none': isPreviewMode || isGameOver }"
      />

      <div class="mt-12 mb-20  gap-4 flex justify-center">
        <Button :disabled="isPreviewMode" @click="onResetBlocksOrRestartGame">
          {{ isGameOver ? '再来一次' : '重选' }}
        </Button>

        <Button v-if="!isGameOver" :disabled="isPreviewMode" type="primary" @click="onCheckCheckedResult">
          检查
        </Button>
      </div>
    </div>
  </main>
</template>@/utils/game/grid@/config/game
