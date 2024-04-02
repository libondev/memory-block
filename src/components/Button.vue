<script lang="ts" setup>
import { VARIANT } from '@/config/theme'

const props = withDefaults(
  defineProps<{
    as: string | Component
    type: keyof typeof VARIANT
    disabled: boolean
  }>(),
  {
    as: 'button',
    type: 'default',
    disabled: false,
  },
)

const emits = defineEmits(['click'])

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
