<script lang="ts" setup>
defineOptions({
  inheritAttrs: false,
})

defineProps({
  color: {
    type: String,
    default: '',
  },
  size: {
    type: String,
    default: 'size-8',
  },
})
</script>

<template>
  <label class="block select-none" :class="[color, size]">
    <input type="checkbox" class="peer hidden" v-bind="$attrs">

    <i class="inline-block w-full h-full rounded-lg transition-all text-white dark:text-black bg-current border-[rgba(0,0,0,.2)] peer-checked:text-inherit peer-checked:bg-current peer-checked:shadow-[0_0_8px_currentColor]">
      <slot />
    </i>
  </label>
</template>
