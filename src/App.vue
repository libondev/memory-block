<script lang="ts" setup>
import { useI18N } from './composables/use-i18n'
import { provideGameSounds } from '@/composables/use-game-sounds'

provideGameSounds()
useI18N()
</script>

<template>
  <div class="h-full flex flex-col">
    <NavHeader />

    <RouterView />
  </div>
</template>
