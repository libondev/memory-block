<script lang="ts" setup>
const props = defineProps({
  as: {
    type: String as PropType<string | Component>,
    default: 'button',
  },
  type: {
    type: String as PropType<keyof typeof VARIANT>,
    default: 'default',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emits = defineEmits(['click'])

const VARIANT = {
  default: 'bg-white dark:bg-gray-700',
  danger: 'bg-red-500 dark:bg-red-500 text-white',
  warning: 'bg-orange-500 dark:bg-orange-600 text-white',
  primary: 'bg-emerald-500 dark:bg-emerald-600 text-white',
  custom: 'bg-violet-500 dark:bg-violet-500 text-white',
}

function onClick(event: MouseEvent) {
  !props.disabled && emits('click', event)
}
</script>

<template>
  <!-- 如果不主动绑定会触发两次, 如果不绑定在外面则可能会因为按下后偏位的问题点击无效 -->
  <div class="inline-block h-10" :class="{ 'opacity-40 pointer-events-none': disabled }" @click="onClick">
    <component
      :is="as"
      class="inline-block px-3 py-1.5 select-none rounded-lg text-sm shadow-sm border-[rgba(0,0,0,.2)] border-x-[1.5px] border-t-[1.5px] border-b-4 active:border-b-[1.5px] active:translate-y-1 active:shadow-none"
      :class="VARIANT[type]"
      v-bind="$attrs"
    >
      <slot />
    </component>
  </div>
</template>
