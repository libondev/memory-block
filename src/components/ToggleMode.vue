<script lang="ts" setup>
import { useStorage } from '@vueuse/core'
import { name } from '../../package.json'
import Button from '@/components/Button.vue'

// 如果用户没有设置过主题选项(包含第一次进入系统)，那么就使用系统的明暗主题设置
const userSystemPreferMode = window.matchMedia('(prefers-color-scheme: dark)').matches
const siteDarkMode = useStorage(`${name}.fe.color-mode`, userSystemPreferMode)

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
  <Button
    @click="onToggleMode"
  >
    <i class="block pointer-events-none" :class="siteDarkMode ? 'i-solar-moon-bold' : 'i-solar-sun-bold'" />
  </Button>
</template>
