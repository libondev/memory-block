<script lang="ts" setup>
import { gameSoundsInjectionKey } from '@/composables/use-game-sounds'

const {
  enableSounds,
  toggleSounds,
} = inject(gameSoundsInjectionKey)!
</script>

<template>
  <header class="mb-4 px-4 sm:px-6 border-b dark:border-gray-700 flex items-center justify-between">
    <h1 class="text-lg font-medium">
      <RouterLink to="/" class="sm:after:content-[attr(data-text)]" data-text="（记忆方块）">
        Memory Block
      </RouterLink>
    </h1>

    <div class="pt-2 flex items-center gap-2">
      <Button @click="toggleSounds()">
        <i class="block" :class="enableSounds ? 'i-solar-volume-loud-broken' : 'i-solar-volume-cross-broken text-red-500'" />
      </Button>

      <!-- <Button as="RouterLink" to="/record">
        <i class="block i-solar-calendar-bold" />
      </Button> -->

      <ToggleDark />

      <Button as="a" href="https://github.com/libondev/memory-block" target="_project">
        <i class="block i-carbon-logo-github" />
      </Button>
    </div>
  </header>
</template>
