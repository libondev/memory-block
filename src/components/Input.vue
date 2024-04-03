<script lang="ts" setup>
const modelValue = defineModel()
</script>

<template>
  <input v-model="modelValue" type="text" class="inline-flex h-8 w-full shadow-sm rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:border-input/50" v-bind="$attrs">
</template>
