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
  <header class="mb-4 px-4 sm:px-6 border-b dark:border-gray-700 flex items-center justify-between">
    <h1 class="text-lg font-medium">
      <RouterLink to="/">
        {{ $t('memory-block', 'Memory Block') }}
      </RouterLink>
    </h1>

    <div class="pt-2 flex items-center gap-2">
      <select
        class="inline-block h-8 mb-2 px-3 select-none rounded-lg text-sm border-[rgba(0,0,0,.2)] border-x-[1.5px] border-t-[1.5px] border-b-4"
        :value="lang"
        @change="e => setLanguage((e.target as HTMLSelectElement).value as Language)"
      >
        <option
          v-for="option of languages"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>

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
