<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    value: number
    color?: 'text-emerald-500' | 'text-red-500'
  }>(),
  {
    value: 0,
    color: 'text-emerald-500',
  },
)

const lastUpdateTimeKey = shallowRef()

const showDeltaValue = shallowRef(false)
const deltaValue = shallowRef(0)

const operater = computed(() => deltaValue.value >= 0 ? '+' : '')

// 增加的动画结束以后隐藏
function onAnimationEnd() {
  showDeltaValue.value = false
}

// 如果数据发生变化则计算差异值
watch(
  () => props.value,
  (newValue, oldValue) => {
    const _delta = newValue - oldValue

    if (_delta === 0) {
      return
    }

    // 如果没有获取到最后修改时间则表示这次数据变更是从本地恢复的, 不应该展示动画
    if (lastUpdateTimeKey.value) {
      showDeltaValue.value = true
    }

    oldValue = newValue
    deltaValue.value = _delta
    lastUpdateTimeKey.value = Date.now()
  },
)

onMounted(() => {
  // 第一次值变化的时候可能是从本地缓存中获取的数据
  // 但这次引起的变更不应该展示动画
  setTimeout(() => {
    lastUpdateTimeKey.value = Date.now()
  }, 500)
})
</script>

<template>
  <div class="relative font-mono">
    <slot>{{ value }}</slot>

    <Transition name="increase">
      <span
        v-show="showDeltaValue"
        :key="lastUpdateTimeKey"
        :class="color"
        class="absolute text-[50%] font-medium duration-500 animate-in fade-in slide-in-from-bottom"
        @animationend="onAnimationEnd"
      >{{ operater }}{{ deltaValue }}</span>
    </Transition>
  </div>
</template>

<style scoped>
.increase-enter-active,
.increase-leave-active {
  transition: all 0.5s ease;
}

.increase-enter-from,
.increase-leave-to {
  opacity: 0;
}
</style>
