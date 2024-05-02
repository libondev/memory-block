<script setup lang="ts">
import { GAME_LEVELS } from '@/config/game'
import { i18NInjectionKey } from '@/composables/use-i18n'

const { lang, $t } = inject(i18NInjectionKey)!

const key = computed(() => lang.value.split('-')[0])
</script>

<template>
  <div className="h-full flex flex-col items-center justify-center">
    <h2 className="mb-12 text-center text-4xl text-medium font-mono">
      {{ $t('memory-block', '记忆方块') }}
    </h2>

    <div className="flex items-center flex-col gap-2">
      <Button v-for="btn of GAME_LEVELS" :key="btn.path" :to="btn.path" :type="btn.type" as="RouterLink">
        {{ (btn as any)[key] }}
      </Button>
    </div>
  </div>
</template>
