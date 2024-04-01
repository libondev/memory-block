<script lang="ts" setup>
defineOptions({
  inheritAttrs: false,
})

const props = defineProps({
  color: {
    type: String,
    default: '',
  },
  size: {
    type: String,
    default: 'size-8',
  },
  isMax: {
    type: Boolean,
    default: false,
  },
})

const emits = defineEmits<(e: 'change', val: Event) => void>()

function handleChange(e: Event) {
  const target = e.target as HTMLInputElement

  if (props.isMax && target.checked) {
    target.checked = false
  } else {
    emits('change', e)
  }
}
</script>

<template>
  <label class="block select-none" :class="[color, size]">
    <input type="checkbox" class="peer hidden" v-bind="$attrs" @change="handleChange">

    <i class="inline-block w-full h-full rounded-lg hover:transition-all text-white dark:text-black bg-current border-[rgba(0,0,0,.2)] peer-checked:text-inherit peer-checked:bg-current peer-checked:shadow-[0_0_8px_currentColor]">
      <slot />
    </i>
  </label>
</template>
