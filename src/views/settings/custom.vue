<script lang="ts" setup>
import { LEVEL_GRIDS } from '@/config/game'
import { i18NInjectionKey } from '@/composables/use-i18n'

const { $t } = inject(i18NInjectionKey)!

const router = useRouter()

const customLevelConfig = ref((() => {
  const cache = localStorage.getItem('customLevelConfig')

  // eslint-disable-next-line unused-imports/no-unused-vars
  const { size, ...configValue } = Object.assign({}, LEVEL_GRIDS.custom, cache ? JSON.parse(cache) : {})

  return configValue
})())

function saveCustomLevelConfig() {
  const illegalValue = Object.values(customLevelConfig.value).find(v => typeof v !== 'number' || v <= 0 || !Number.isInteger(v))

  if (illegalValue) {
    useToastError($t('configuration-integer-gt', '配置只能为大于 1 的整数'))

    return
  }

  let size = 'size-8'

  const { grid, min, max } = customLevelConfig.value

  if (grid <= 4) {
    size = 'size-12'
  } else if (grid <= 6) {
    size = 'size-11'
  } else if (grid <= 7) {
    size = 'size-10'
  } else if (grid <= 9) {
    size = 'size-9'
  }

  // 保证 min 小于等于 max
  if (min > max) {
    [customLevelConfig.value.max, customLevelConfig.value.min] = [customLevelConfig.value.min, customLevelConfig.value.max]
  }

  // 如果最大/最小值超过了格子数，就设置为格子数
  if (max > grid * grid) {
    customLevelConfig.value.max = grid * grid
  } else if (min > grid * grid) {
    customLevelConfig.value.min = grid * grid
  }

  localStorage.setItem('customLevelConfig', JSON.stringify({ size, ...customLevelConfig.value }))

  router.push('/game/custom')
}
</script>

<template>
  <div class="flex h-full py-16 items-center justify-center overflow-auto">
    <form class="w-72" @submit.prevent="saveCustomLevelConfig">
      <h2 class="text-xl mb-2">
        {{ $t('custom-levels', '自定义关卡') }}
      </h2>

      <div class="mb-4">
        <span class="text-sm">{{ $t('number-of-grids', '网格数量') }}<i class="text-gray-500">（X * Y）</i></span>
        <Input v-model.number="customLevelConfig.grid" maxlength="2" />
      </div>

      <div class="mb-4">
        <span class="text-sm">{{ $t('minimum-blocks', '最小生成方块数') }}</span>
        <Input v-model.number="customLevelConfig.min" maxlength="2" />
      </div>

      <div class="mb-4">
        <span class="text-sm">{{ $t('maximum-blocks', '最大生成方块数') }}</span>
        <Input v-model.number="customLevelConfig.max" maxlength="2" />
      </div>

      <!-- <div class="mb-4">
        <span class="text-sm">得分倍率<i class="text-gray-500">（自定义模式下不可用）</i></span>
        <Input :model-value="customLevelConfig.rate" disabled />
      </div> -->

      <div class="mb-4">
        <span class="text-sm">{{ $t('hp', '生命值') }}</span>
        <Input v-model.number="customLevelConfig.health" maxlength="15" />
      </div>

      <div class="mb-8">
        <span class="text-sm">{{ $t('memory-time', '每回合开始前的记忆时间') }}<i class="text-gray-500">（{{ $t('second', '秒') }}）</i></span>
        <Input v-model.number="customLevelConfig.internal" maxlength="2" />
      </div>

      <Button type="primary">
        {{ $t('setup-completed', '设置完成，开始游戏') }}
      </Button>
    </form>
  </div>
</template>
