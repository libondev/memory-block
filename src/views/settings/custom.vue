<script lang="ts" setup>
import { LEVEL_GRIDS } from '@/config/game'
import { i18NInjectionKey } from '@/composables/use-i18n'

const { $t } = inject(i18NInjectionKey)!

const router = useRouter()

const alwaysFillFull = ref(false)

const customLevelConfig = ref((() => {
  const cache = localStorage.getItem('customLevelConfig')

  // eslint-disable-next-line unused-imports/no-unused-vars
  const { size, fillFull, ...configValue } = Object.assign({ fillFull: false }, LEVEL_GRIDS.custom, cache ? JSON.parse(cache) : {})

  alwaysFillFull.value = fillFull

  return configValue
})())

let toastTimeout = 0

function saveCustomLevelConfig() {
  if (toastTimeout) {
    return
  }

  const illegalValue = Object.values<number>(customLevelConfig.value).find(v => typeof v !== 'number' || v <= 0 || !Number.isInteger(v))

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

  // 如果最大/最小值超过了格子数，就设置为格子数
  if (max > grid * grid) {
    customLevelConfig.value.max = grid * grid
  }

  if (min > grid * grid) {
    customLevelConfig.value.min = grid * grid
  }

  // 保证 min 小于等于 max
  if (min > max) {
    [customLevelConfig.value.max, customLevelConfig.value.min] = [customLevelConfig.value.min, customLevelConfig.value.max]
  }

  localStorage.setItem('customLevelConfig', JSON.stringify({
    size,
    fillFull: alwaysFillFull.value,
    ...customLevelConfig.value,
  }))

  toastTimeout = window.setTimeout(() => {
    useToast($t('save-success', '设置成功'))
    router.push('/game/custom')
  }, 300)
}
</script>

<template>
  <div class="flex h-full py-16 items-center justify-center overflow-auto">
    <form class="w-72" @submit.prevent="saveCustomLevelConfig()">
      <h2 class="text-xl mb-2">
        {{ $t('custom-levels', '自定义关卡') }}
      </h2>

      <div class="mb-4">
        <span class="text-sm">{{ $t('number-of-grids', '网格数量') }}<span class="text-gray-500">&nbsp;(X * Y)</span></span>
        <Input v-model.number="customLevelConfig.grid" type="number" min="1" max="99" />
      </div>

      <div class="mb-4">
        <span class="text-sm">{{ $t('minimum-blocks', '最小生成方块数') }}</span>
        <Input v-model.number="customLevelConfig.min" type="number" min="1" max="99" />
      </div>

      <div class="mb-4 flex items-center">
        <div>
          <span class="text-sm">{{ $t('maximum-blocks', '最大生成方块数') }}<span class="text-gray-500">&nbsp;(MAX = {{ customLevelConfig.grid * customLevelConfig.grid }})</span></span>
          <Input v-model.number="customLevelConfig.max" type="number" maxlength="2" />
        </div>

        <div class="px-2 text-center">
          <span class="text-sm">{{ $t('1', '始终填满') }}</span>
          <Switch v-model="alwaysFillFull" class="translate-y-[3px]" />
        </div>
      </div>

      <!-- <div class="mb-4">
        <span class="text-sm">得分倍率<i class="text-gray-500">（自定义模式下不可用）</i></span>
        <Input :model-value="customLevelConfig.rate" disabled />
      </div> -->

      <div class="mb-4">
        <span class="text-sm">{{ $t('hp', '生命值') }}</span>
        <Input v-model.number="customLevelConfig.health" type="number" maxlength="15" />
      </div>

      <div class="mb-8">
        <span class="text-sm text-balance">{{ $t('memory-time', '每回合开始前的记忆时间') }}<span class="text-gray-500">({{ $t('second', '秒') }})</span></span>
        <Input v-model.number="customLevelConfig.internal" type="number" min="1" max="99" />
      </div>

      <Button type="primary">
        {{ $t('setup-completed', '开始游戏') }}
      </Button>
    </form>
  </div>
</template>
