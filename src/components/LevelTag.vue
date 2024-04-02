<script lang="ts" setup>
import { GAME_LEVELS, type GameLevel } from '@/config/game'
import { COLORS } from '@/config/theme.ts'

withDefaults(
  defineProps<{
    level: GameLevel
  }>(),
  {
    level: 'easy',
  },
)
</script>

<template>
  <span class="inline-block p-1 rounded-md text-xs shadow-sm border-[1.5px] border-[rgba(0,0,0,.2)]" :class="COLORS[level]">
    {{ GAME_LEVELS[level].zh }}
  </span>
</template>
