<script lang="ts" setup>
import { useStorage } from '@vueuse/core'

// 如果用户没有设置过主题选项(包含第一次进入系统)，那么就使用系统的明暗主题设置
const userSystemPreferMode = window.matchMedia('(prefers-color-scheme: dark)').matches
const siteDarkMode = useStorage('ai.fe.color-mode', userSystemPreferMode)

const rootElement = document.documentElement.classList

function setDarkMode() {
  if (siteDarkMode.value) {
    rootElement.add('dark')
    return
  }

  rootElement.remove('dark')
}

function onToggleMode() {
  siteDarkMode.value = !siteDarkMode.value

  setDarkMode()
}

setDarkMode()
</script>

<template>
  <button
    class="cursor-pointer p-2 rounded hover:bg-accent text-xl hover:text-foreground/80 text-foreground/60"
    @click="onToggleMode"
  >
    <i class="block pointer-events-none" :class="siteDarkMode ? 'i-solar-moon-bold' : 'i-solar-sun-bold'" />
  </button>
</template>
