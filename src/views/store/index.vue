<script lang="ts" setup>
import { GAME_GOODS, type GameGood } from '@/config/goods'
import {
  getGameGoods,
  getGameMoney,
  setGameGoods,
  setGameMoney,
} from '@/composables/use-local-cache'

const gameGoods = ref<GameGood[]>([])

const gameMoney = shallowRef(0)

function buyGood(good: typeof GAME_GOODS[number]) {
  if (gameMoney.value < good.price) {
    useToast('金币不足')

    return
  }

  gameMoney.value -= good.price
  setGameMoney(gameMoney.value)

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
    <div class="w-full flex items-center justify-center mt-4 mb-8 text-3xl font-mono">
      <i class="i-solar-chat-round-money-bold mr-1.5 text-yellow-400" />
      {{ gameMoney }}
    </div>

    <ul class="flex flex-wrap items-center gap-4 w-full">
      <li v-for="good of gameGoods" :key="good.id" class="flex w-full rounded-lg p-2 sm:w-80 overflow-hidden dark:border-white/20 border">
        <div class="min-w-[100px] w-[100px] h-[100px] flex items-center justify-center relative before:absolute before:rounded-md before:inset-0 before:bg-current before:z-0 before:opacity-15" :class="good.color">
          <i :class="good.icon" class="text-6xl relative z-10" />

          <span class="absolute bottom-0.5 right-0.5 z-10 select-none flex items-center text-sm font-medium rounded-sm px-1 text-foreground bg-white/70 dark:bg-white/20">
            <i class="i-solar-chat-round-money-bold mr-0.5 text-yellow-400" />
            {{ good.price }}
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
            <button class="flex items-center justify-center w-full text-sm rounded-md py-1 px-2 text-white font-medium bg-emerald-500 active:bg-emerald-600 dark:bg-emerald-600 dark:active:bg-emerald-700 shadow-sm cursor-pointer" @click="buyGood(good)">
              <i class="i-solar-bag-3-bold-duotone translate-y-[1px] text-lg mr-1" />
              Buy
            </button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
