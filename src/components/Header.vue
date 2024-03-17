<script lang="ts" setup>
import ToggleMode from './ToggleMode.vue'
</script>

<template>
  <header class="mb-4 px-6 border-b dark:border-gray-700 flex items-center justify-between">
    <h1 class="text-lg font-medium">
      <RouterLink to="/">
        Memory Block（记忆方块）
      </RouterLink>
    </h1>

    <div class="pt-2 flex items-center gap-2">
      <!-- <Button>
          <i class="block i-solar-volume-loud-broken" />
          <i class="block i-solar-volume-cross-broken" />
        </Button> -->

      <Button as="RouterLink" to="/record">
        <i class="block i-solar-calendar-bold" />
      </Button>

      <ToggleMode />

      <Button as="a" href="https://github.com/libondev/memory-block" target="_project">
        <i class="block i-carbon-logo-github" />
      </Button>
    </div>
  </header>
</template>
