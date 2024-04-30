<script lang="ts" setup>
import { gameSoundsInjectionKey } from '@/composables/use-game-sounds'
import { i18NInjectionKey } from '@/composables/use-i18n'
import type { Language } from '@/composables/use-local-cache'
import { languages } from '@/config/game'

const {
  enableSounds,
  toggleSounds,
} = inject(gameSoundsInjectionKey)!

const { lang, setLanguage, $t } = inject(i18NInjectionKey)!
</script>

<template>
  <header class="relation z-10 px-3 sm:px-6 border-b dark:border-gray-700 bg-[hsl(var(--background))] flex items-center justify-between">
    <h1 class="flex items-center text-lg font-medium">
      <img class="inline-block size-6 mr-0.5 translate-y-[1px]" width="24" src="/res/logo.svg" alt="">
      <RouterLink to="/" class="truncate">
        {{ $t('memory-block', 'Memory Block') }}
      </RouterLink>
    </h1>

    <div class="pt-2 flex items-center gap-1.5 ml-1">
      <Select v-model="lang" :options="languages" @update:model-value="(e: unknown) => setLanguage(e as Language)" />

      <Button btn-class-name="!px-2" as="RouterLink" to="/store">
        <i class="block i-carbon-store" />
      </Button>

      <Button btn-class-name="!px-2" @click="toggleSounds()">
        <i class="block" :class="enableSounds ? 'i-solar-volume-loud-broken' : 'i-solar-volume-cross-broken text-red-500'" />
      </Button>

      <!-- <Button as="RouterLink" to="/record">
        <i class="block i-solar-calendar-bold" />
      </Button> -->

      <ToggleDark />

      <Button btn-class-name="!px-2" as="a" href="https://github.com/libondev/memory-block" target="_project">
        <i class="block i-carbon-logo-github" />
      </Button>
    </div>
  </header>
</template>
