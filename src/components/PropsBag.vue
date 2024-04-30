<script setup lang="ts">
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'
import type { GameGood } from '@/config/goods'
import { getGameGoods, setGameGoods } from '@/composables/use-local-cache'

defineProps<{
  disabled?: boolean
}>()

const emits = defineEmits<{
  (eventName: 'use-props', good: GameGood): void
}>()

const popoverTriggerRef = shallowRef<typeof PopoverButton>()

const goods = ref<GameGood[]>([])

function onClickGood(good: GameGood) {
  if (good.count <= 0) {
    return
  }

  good.count -= 1
  emits('use-props', good)

  setGameGoods(goods.value)

  popoverTriggerRef.value!.el.click()
}

onMounted(async () => {
  goods.value = await getGameGoods() || []
})
</script>

<template>
  <Popover class="relative" :class="{ 'opacity-40 pointer-events-none': disabled }">
    <PopoverButton
      ref="popoverTriggerRef"
      :disabled
      class="inline-block px-3 py-1.5 select-none rounded-lg text-sm shadow-sm dark:bg-gray-700 border-[rgba(0,0,0,.2)] border-x-[1.5px] border-t-[1.5px] border-b-4 active:border-b-[1.5px] active:translate-y-1 active:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
    >
      道具栏
    </PopoverButton>

    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="translate-y-1 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-1 opacity-0"
    >
      <PopoverPanel class="absolute right-0 bottom-full mb-2 z-10 p-1 border rounded-md bg-[hsl(var(--background))] shadow-sm w-max select-none" as="ul">
        <li
          v-for="good of goods"
          :key="good.id"
          class="relative flex items-center pl-2 pr-2 py-1 rounded hover:bg-secondary cursor-pointer"
          @click="onClickGood(good)"
        >
          <i :class="[good.icon, good.color]" />

          &nbsp;&nbsp;{{ good.name }}

          <span class="text-white bg-red-500 rounded-e-full rounded-s-full text-xs px-1 absolute right-0 -top-0.5">
            {{ good.count }}
          </span>
        </li>
      </PopoverPanel>
    </Transition>
  </Popover>
</template>
