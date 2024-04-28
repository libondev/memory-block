<script lang="ts" setup>
defineProps<{
  isMax: boolean
  config: {
    size: string
    grid: number
  }
}>()

const emits = defineEmits<
  (e: 'change', val: Event) => void
>()

function handleChange(e: Event) {
  emits('change', e)
}
</script>

<template>
  <div class="game-grid w-max mx-auto border dark:border-gray-600 border-l-0 border-b-0">
    <div v-for="_row, rowIndex of config.grid" :key="_row" class="flex border-inherit border-b">
      <div v-for="_col, colIndex of config.grid" :key="_col" class="border-inherit border-l p-1">
        <GridItem
          :size="config.size"
          :is-max="isMax"
          color="text-emerald-500"
          :data-axis="`${rowIndex},${colIndex}`"
          @change="handleChange"
        />
      </div>
    </div>
  </div>
</template>
