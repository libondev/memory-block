<script lang="ts" setup>
import { provideGameSounds } from '@/composables/use-game-sounds'

provideGameSounds()
</script>

<template>
  <div class="h-full flex flex-col">
    <Header />

    <RouterView />
  </div>
</template>
