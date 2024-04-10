<script lang="ts" setup>
import { gameSoundsInjectionKey } from '@/composables/use-game-sounds'
import { i18NInjectionKey } from '@/composables/use-i18n'
import { languages } from '@/config/game'

const {
  enableSounds,
  toggleSounds,
} = inject(gameSoundsInjectionKey)!

const { lang, $t } = inject(i18NInjectionKey)!
</script>

<template>
  <header class="relation z-10 mb-4 px-3 sm:px-6 border-b dark:border-gray-700 bg-[hsl(var(--background))] flex items-center justify-between">
    <h1 class="text-lg font-medium">
      <RouterLink to="/">
        {{ $t('memory-block', 'Memory Block') }}
      </RouterLink>
    </h1>

    <div class="pt-2 flex items-center gap-2">
      <Select v-model="lang" :options="languages" />

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
