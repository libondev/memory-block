<script lang="ts" setup>
import { GAME_GOODS, type GameGood } from '@/config/goods'
import {
  getGameGoods,
  getGameMoney,
  setGameGoods,
  setGameMoney,
} from '@/composables/use-local-cache'

const gameGoods = ref<GameGood[]>(GAME_GOODS)

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
  setGameGoods(
    gameGoods.value,
  )
}

onMounted(() => {
  getGameMoney().then((money) => {
    gameMoney.value = money || 0
  })

  getGameGoods().then((goods) => {
    goods ??= []

    if (goods.length === 0) {
      return
    }

    gameGoods.value = goods.reduce<GameGood[]>((list, good) => {
      const targetGood = GAME_GOODS.find(g => g.id === good.id)

      // 以最新的配置为准
      if (targetGood) {
        Object.assign(targetGood, good)

        list.push(targetGood)
      }

      return list
    }, [])
  })
})
</script>

<template>
  <div class="h-full w-full max-w-[700px] px-4 select-none mx-auto overflow-auto">
    <div class="w-full flex items-center justify-center mt-4 mb-8 text-3xl font-mono">
      <i class="i-solar-chat-round-money-bold mr-1.5 text-yellow-400" />
      {{ gameMoney }}
    </div>

    <ul class="flex flex-wrap items-center gap-4 w-full">
      <li v-for="good of gameGoods" :key="good.id" class="flex w-full sm:w-80 overflow-hidden dark:border-white/20 border cursor-pointer" @click="buyGood(good)">
        <div class="min-w-[100px] w-[100px] h-[100px] flex items-center justify-center relative before:absolute before:inset-0 before:bg-current before:z-0 before:opacity-15" :class="good.color">
          <i :class="good.icon" class="text-6xl relative z-10" />
        </div>

        <div class="pt-2 px-3">
          <span class="font-medium">{{ good.name }}</span>

          <p class="h-9 text-xs opacity-60 text-pretty">
            {{ good.description }}
          </p>

          <div class="flex items-center justify-between">
            <span class="flex items-center">
              <i class="i-solar-chat-round-money-bold mr-1 text-yellow-400" />
              {{ good.price }}
            </span>

            <span class="flex items-center">
              x{{ good.count }}
            </span>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
