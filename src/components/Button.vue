<script lang="ts" setup>
defineProps({
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

defineEmits(['click'])

const VARIANT = {
  default: 'bg-white dark:bg-gray-800',
  danger: 'bg-red-500 text-white',
  warning: 'bg-orange-500 text-white',
  primary: 'bg-emerald-500 text-white',
}
</script>

<template>
  <!-- 如果不主动绑定会触发两次, 如果不绑定在外面则可能会因为按下后偏位的问题点击无效 -->
  <div class="inline-block h-10" :class="{ 'opacity-40 pointer-events-none': disabled }" @click="$emit('click', ev)">
    <component
      :is="as"
      class="inline-block select-none rounded-lg px-3 py-1.5 text-sm border-[rgba(0,0,0,.2)] border-x-[1.5px] border-t-[1.5px] border-b-4 active:border-b-[1.5px] active:translate-y-1"
      :class="VARIANT[type]"
      v-bind="$attrs"
    >
      <slot />
    </component>
  </div>
</template>
