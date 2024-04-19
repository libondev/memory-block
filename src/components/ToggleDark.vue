<script lang="ts" setup>
import { useDark, useToggle } from '@vueuse/core'
import { name } from '@/../package.json'
import Button from '@/components/Button.vue'

// 如果用户没有设置过主题选项(包含第一次进入系统)，那么就使用系统的明暗主题设置
const isDark = useDark({ storageKey: `${name}.fe.color-mode` })
const toggleDark = useToggle(isDark)
</script>

<template>
  <Button btn-class-name="!px-2" @click="toggleDark()">
    <i class="block pointer-events-none" :class="isDark ? 'i-solar-moon-bold' : 'i-solar-sun-bold'" />
  </Button>
</template>
