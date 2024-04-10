<script lang="ts" setup>
const modelValue = defineModel<boolean>()
</script>

<template>
  <label class="inline-flex items-center cursor-pointer">
    <input v-model="modelValue" type="checkbox" value="" class="sr-only peer" :checked="modelValue">
    <div
      class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/50 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"
    />
    <span v-if="$slots.default" class="text-sm font-medium text-gray-900 dark:text-gray-300">
      <slot :status="modelValue" />
    </span>
  </label>
</template>

<style lang="scss" scoped></style>
