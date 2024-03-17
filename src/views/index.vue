<script setup lang="ts">
import { LEVELS } from '@/config/game'
</script>

<template>
  <div className="h-full flex flex-col items-center justify-center">
    <h2 className="-mt-32 text-center text-3xl text-medium font-mono">
      Memory Block
      <br>
      记忆方块
    </h2>

    <div className="mt-20 flex items-center flex-col gap-2">
      <Button v-for="btn of LEVELS" :key="btn.path" :to="btn.path" :type="btn.type" as="RouterLink">
        {{ btn.zh }}
      </Button>
    </div>
  </div>
</template>
