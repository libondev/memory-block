<script lang="ts" setup>
defineOptions({
  name: 'GridItem',
  inheritAttrs: false,
})

const props = withDefaults(
  defineProps<{
    color: string
    size: string
    isMax: boolean
  }>(),
  {
    color: '',
    size: 'size-8',
    isMax: false,
  },
)

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

    <i class="bubbly relative inline-block w-full h-full rounded-lg text-transparent bg-current hover:transition-all peer-checked:text-inherit peer-checked:shadow-[0_0_8px_currentColor]" />
  </label>
</template>

<style lang="scss">
.bubbly {
  &::before,
  &::after {
    content: '';
    position: absolute;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    pointer-events: none;
    background-repeat: no-repeat;
  }

  &::before {
    display: none;
    top: -75%;
    background-image:
      radial-gradient(circle, var(--c1) 20%, transparent 20%),
      radial-gradient(circle, transparent 20%, var(--c5) 20%, transparent 30%),
      radial-gradient(circle, var(--c3) 20%, transparent 20%),
      radial-gradient(circle, var(--c6) 20%, transparent 20%),
      radial-gradient(circle, transparent 10%, var(--cp) 15%, transparent 20%),
      radial-gradient(circle, var(--c2) 20%, transparent 20%),
      radial-gradient(circle, var(--c5) 20%, transparent 20%),
      radial-gradient(circle, var(--c4) 20%, transparent 20%),
      radial-gradient(circle, var(--c3) 20%, transparent 20%);
    background-size: 30% 30%, 35% 35%, 28% 28%, 26% 26%, 30% 30%, 20% 20%, 15% 15%, 30% 30%, 25% 25%;
  }

  &::after {
    display: none;
    bottom: -75%;
    background-image:
      radial-gradient(circle, var(--cp) 20%, transparent 20%),
      radial-gradient(circle, var(--c3) 20%, transparent 20%),
      radial-gradient(circle, transparent 10%, var(--c2) 15%, transparent 20%),
      radial-gradient(circle, var(--c6) 20%, transparent 20%),
      radial-gradient(circle, var(--c4) 20%, transparent 20%),
      radial-gradient(circle, var(--c6) 20%, transparent 20%),
      radial-gradient(circle, var(--c1) 20%, transparent 20%),
      radial-gradient(circle, var(--c4) 20%, transparent 20%),
      radial-gradient(circle, var(--c1) 20%, transparent 20%),
      radial-gradient(circle, var(--c5) 20%, transparent 20%);
    background-size: 30% 30%, 20% 20%, 25% 25%, 18% 18%, 25% 25%, 30% 30%, 20% 20%, 25% 25%, 18% 18%, 25% 25%,;
  }
}

.playing .peer:checked+.bubbly{
  &:before {
    display: block;
    animation: topBubbles ease-in-out 0.75s forwards;
  }

  &:after {
    display: block;
    animation: bottomBubbles ease-in-out 0.75s forwards;
  }
}

@keyframes topBubbles {
  0% {
    background-position: 5% 70%, 10% 70%, 10% 70%, 15% 70%, 25% 70%, 25% 70%, 40% 70%, 55% 70%, 70% 70%;
  }

  50% {
    background-position: 0% 60%, 0% 20%, 10% 40%, 20% 0%, 30% 30%, 22% 50%, 50% 50%, 65% 20%, 70% 30%;
  }

  100% {
    background-position: 0% 10%, 0% 10%, 10% 30%, 20% -10%, 30% 20%, 22% 40%, 50% 40%, 65% 10%, 60% 20%;
    background-size: 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%;
  }
}

@keyframes bottomBubbles {
  0% {
    background-position: 10% -10%, 30% 10%, 55% -10%, 70% -10%, 85% -10%, 70% -10%, 70% 0%;
  }

  50% {
    background-position: 0% 60%, 20% 60%, 45% 60%, 60% 100%, 75% 70%, 95% 60%, 105% 0%;
  }

  100% {
    background-position: 0% 70%, 20% 70%, 45% 70%, 60% 110%, 75% 60%, 95% 70%, 110% 10%;
    background-size: 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%;
  }
}
</style>
