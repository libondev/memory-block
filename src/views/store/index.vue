<script lang="ts" setup>
import { GAME_GOODS, type GameGood } from '@/config/goods'
import {
  getGameGoods,
  getGameMoney,
  setGameGoods,
  setGameMoney,
} from '@/composables/use-local-cache'

const {
  success: playSuccessSound,
} = useGameSounds()

const gameGoods = ref<GameGood[]>([])

const gameMoney = shallowRef(0)

// 商人倒计时
const comingCountdown = computed(() => {
  const now = new Date()

  // 如果已经是星期六和星期天则返回 0
  if ([0, 6].includes(now.getDay())) {
    return 0
  }

  const nextWeekend = new Date(now.getFullYear(), now.getMonth(), now.getDate() + (6 - now.getDay()))

  return Math.ceil((nextWeekend.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
})

function buyGood(good: typeof GAME_GOODS[number]) {
  if (gameMoney.value < good.price) {
    useToast('金币不足')

    return
  }

  // 商人来了就使用折扣价, 否则原价
  const goodPrice = comingCountdown.value ? good.price : good.price * good.discountPrice

  gameMoney.value -= goodPrice
  setGameMoney(gameMoney.value)

  playSuccessSound()

  const targetGood = gameGoods.value.find(g => g.id === good.id)

  if (!targetGood) {
    return
  }

  targetGood.count++

  saveGoodsToLocalStorage()
}

function saveGoodsToLocalStorage() {
  setGameGoods(gameGoods.value)
}

onMounted(() => {
  getGameMoney().then((money) => {
    gameMoney.value = money || 0
  })

  getGameGoods().then((goods) => {
    goods ??= []

    if (goods.length === 0) {
      gameGoods.value = GAME_GOODS
      return
    }

    gameGoods.value = GAME_GOODS.reduce<GameGood[]>((list, good) => {
      // 从本地存储中找到对应的商品
      const targetLocalGood = goods.find(g => g.id === good.id)

      // 以最新的配置为准
      if (targetLocalGood) {
        // 更新为本地道具的购买数量
        good.count = Math.max(targetLocalGood.count, 0)
      }

      list.push(good)

      return list
    }, [])
  })
})
</script>

<template>
  <div class="h-full w-full max-w-[700px] px-4 mx-auto overflow-auto">
    <div class="w-full flex items-center justify-center mt-16 font-mono">
      <i class="i-solar-chat-round-money-bold mr-1.5 text-3xl text-yellow-400" />
      <Increase :value="gameMoney" class="text-[45px] font-medium" color="text-red-500" />
    </div>

    <div v-if="comingCountdown" class="text-center text-xl my-6">
      流浪商人还有 <span class="font-bold text-emerald-500">{{ comingCountdown }}</span> 天抵达...
    </div>

    <div v-else class="mb-6 pl-2 relative">
      <img src="@/assets/merchant.png" class="h-40" alt="">

      <div class="absolute left-32 right-4 top-2 sm:top-8 p-2 rounded-lg border border-input">
        你好，我是<span class="line-through opacity-30">(流浪)</span>旅行至此的商人，我每周末都会为你带来更低的价格<span class="line-through opacity-30">(别问为什么，问就是老板是我表哥)</span>，随便看看吧！<span class="line-through opacity-30">(商品滞销帮帮我们)</span>
      </div>
    </div>

    <ul class="flex flex-wrap items-center gap-4 w-full font-medium">
      <li v-for="good of gameGoods" :key="good.id" class="flex w-full rounded-lg p-2 sm:w-80 overflow-hidden dark:border-white/20 border">
        <div class="min-w-[100px] w-[100px] h-[100px] flex items-center justify-center relative before:absolute before:rounded-md before:inset-0 before:bg-current before:z-0 before:opacity-15" :class="good.color">
          <i :class="good.icon" class="text-6xl relative z-10" />

          <span class="absolute bottom-0.5 right-0.5 z-10 select-none flex items-center text-sm rounded-sm px-1 text-foreground bg-white/70 dark:bg-white/20">
            <i class="i-solar-chat-round-money-bold size-[14px] text-yellow-400" />
            <span
              :data-original="good.price"
              :class="{ 'before:inline-block before:-mx-0.5 before:content-[attr(data-original)] before:text-red-500 before:line-through before:scale-75': !comingCountdown }"
            >{{ comingCountdown ? good.price : good.price * good.discountPrice }}</span>
          </span>
        </div>

        <div class="flex flex-col pl-3">
          <span class="font-medium">
            {{ good.name }}

            <span class="text-sm font-normal">
              x{{ good.count }}
            </span>
          </span>

          <p class="mt-1 flex-1 text-xs opacity-60 text-pretty">
            {{ good.description }}
          </p>

          <div class="flex items-center justify-between gap-2 select-none">
            <button
              class="flex items-center justify-center w-full text-sm rounded-md py-1 px-2 text-white font-medium bg-emerald-500 active:bg-emerald-600 dark:bg-emerald-600 dark:active:bg-emerald-700 outline-none shadow-sm cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
              @click="buyGood(good)"
            >
              <i class="i-solar-bag-3-bold-duotone translate-y-[1px] text-lg mr-1" />
              Buy
            </button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
