<script lang="ts" setup>
import Toggle from '@/components/Toggle.vue'

defineProps({
  config: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <div class="w-max mx-auto border dark:border-gray-600 border-l-0 border-b-0">
    <div v-for="_row, rowIndex of config.grid" :key="_row" class="flex border-inherit border-b">
      <div v-for="_col, colIndex of config.grid" :key="_col" class="border-inherit border-l p-1">
        <Toggle
          :size="config.size"
          color="text-emerald-500"
          :data-axis="`${rowIndex},${colIndex}`"
        />
      </div>
    </div>
  </div>
</template>
