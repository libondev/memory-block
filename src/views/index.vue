<script setup lang="ts">
import Button from '@/components/Button.vue'
import { LEVEL_BUTTONS } from '@/config/game'
</script>

<template>
  <div className="h-full flex flex-col items-center justify-center">
    <h1 className="-mt-36 text-center text-3xl text-medium font-mono">
      Memory Block
      <br>
      记忆方块
    </h1>

    <div className="mt-20 flex items-center flex-col gap-2">
      <Button v-for="btn of LEVEL_BUTTONS" :key="btn.path" :to="btn.path" :type="btn.type" as="RouterLink">
        {{ btn.zh }}
      </Button>
    </div>
  </div>
</template>@/config/game
