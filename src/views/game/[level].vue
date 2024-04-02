<script lang="ts" setup>
import confetti from 'canvas-confetti'

import { LEVEL_GRIDS, type Level } from '@/config/game'

import { useGameScope } from '@/composables/use-game-scope'
import { useCheckedBlocks } from '@/composables/use-checked-blocks'
import { getHighestScoreInHistory, setHighestScoreInHistory } from '@/composables/use-local-cache'

const level = useRoute().params.level as Level || 'easy'
const levelConfig = LEVEL_GRIDS[level] || LEVEL_GRIDS.easy

const isGameOver = shallowRef(false)
const isGamePause = shallowRef(false)
const isPreviewMode = shallowRef(true)
const getScopeVisible = shallowRef(false)

const gameHealth = shallowRef(levelConfig.health)
const checkedNumber = shallowRef(0)

const highestScore = shallowRef(0)
const showHighestScoreBadge = shallowRef(false)

const gameHealthList = computed(() => Array.from({ length: levelConfig.health + 1 }, (_, i) => i))

// 生成随机高亮的块
const targetBlocks = shallowRef(new Set<string>())

const {
  fail: playFailSound,
  over: playOverSound,
  error: playErrorSound,
  success: playSuccessSound,
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

async function startGame() {
  resetCountdown()
  startCountdown()

  checkedNumber.value = 0
  isGamePause.value = false
  isPreviewMode.value = true
  showHighestScoreBadge.value = false
  targetBlocks.value = generateRandomTarget(levelConfig)
  // 获取历史最高分
  highestScore.value = await getHighestScoreInHistory(level) || 0

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
    playSuccessSound()

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

    playErrorSound()
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
  playFailSound()
  markAllMissBlocks()
  markAllWrongBlocks()
  useToastError('游戏结束')
  isGameOver.value = true

  // 如果分数比历史最高分高, 更新历史最高分, 并播放纸屑
  if (gameScope.value > highestScore.value) {
    highestScore.value = gameScope.value
    showHighestScoreBadge.value = true

    playOverSound()
    confetti({ spread: 120, particleCount: 300 })
    setHighestScoreInHistory(level, gameScope.value)
  }

  // 有分数才生成纸屑, 否则会有点嘲笑 0 分的意思:)
  // 游戏结束时, 分数越高, 生成越多的纸屑
  // if (gameScope.value > 0) {
  // }
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
      <h2 className="w-full flex items-center justify-center text-xl">
        {{ isPreviewMode ? '请记住以下方块位置' : isGameOver ? '游戏结束' : '游戏开始' }}
        <span v-show="countdown" class="font-mono">({{ countdown }})</span>
      </h2>

      <div class="my-8 text-[40px] font-mono text-center relative">
        <span class="z-10 relative font-medium">{{ gameScope }}</span>

        <span v-if="showHighestScoreBadge" class="absolute -translate-x-2 text-xs rotate-45 inline-block font-bold px-2 rounded-full border-2 border-red-500 text-red-500">BEST</span>

        <Transition name="increase-scope">
          <span
            v-show="getScopeVisible"
            class="absolute text-[60%] text-emerald-500 duration-500 animate-in fade-in slide-in-from-bottom"
            @animationend="onAnimationend"
          >+{{ deltaScope }}</span>
        </Transition>
      </div>

      <!-- 历史最高分 -->
      <div class="flex justify-between items-center text-lg font-mono">
        <span class="flex items-center">
          <i class="i-solar-ranking-broken translate-y-[-1.5px] mr-0.5" />
          {{ highestScore }}
        </span>
      </div>

      <div class="flex mb-1 justify-between items-center text-lg font-mono">
        <span class="flex items-center">
          <i class="i-solar-stop-bold text-emerald-500 mr-0.5" />
          {{ checkedNumber }}<span class="text-sm translate-y-[2px]">/{{ targetBlocks.size }}</span>
        </span>

        <span class="flex-1 flex items-center justify-center">
          <i class="i-solar-alarm-add-broken mr-0.5" />
          {{ timestamp }}s
        </span>

        <span class="flex items-center">
          <i class="i-solar-health-bold text-xl text-red-500 mr-0.5" />
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

      <GameGrid
        :config="levelConfig"
        :is-max="checkedNumber >= targetBlocks.size"
        :class="isPreviewMode || isGameOver || isGamePause ? 'pointer-events-none' : 'playing'"
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
          class="w-[70px]"
          @click="onCheckResult"
        >
          {{ isGamePause ? '继续' : '选好了' }}
        </Button>
      </div>
    </div>
  </main>
</template>

<style>
.increase-scope-enter-active,
.increase-scope-leave-active {
  transition: all 0.5s ease;
}

.increase-scope-enter-from,
.increase-scope-leave-to {
  opacity: 0;
}
</style>
