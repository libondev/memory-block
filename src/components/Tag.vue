<script lang="ts" setup>
import { LEVELS, type Level } from '@/config/game'
import { COLORS } from '@/config/theme.ts'

defineProps({
  level: {
    type: String as PropType<Level>,
    default: 'easy',
  },
})
</script>

<template>
  <span class="inline-block p-1 rounded-md text-xs shadow-sm border-[1.5px] border-[rgba(0,0,0,.2)]" :class="COLORS[level]">
    {{ LEVELS[level].zh }}
  </span>
</template>
