<script lang="ts" setup>
import type { RecordItem } from '@/composables/use-local-cache'
import { getTargetDateRecords } from '@/composables/use-local-cache'
import { i18NInjectionKey } from '@/composables/use-i18n'

const { $t } = inject(i18NInjectionKey)!

const route = useRoute()

const records = shallowRef<RecordItem[]>([])

onMounted(async () => {
  records.value = (await getTargetDateRecords(route.params.date as string)) || []
})
</script>

<template>
  <div class="w-full h-full scrollbar">
    <ul class="max-w-[500px] mx-auto flex flex-col-reverse">
      <li v-for="record of records" :key="record.startTime" class="mb-2 py-2">
        <LevelTag :level="record.level" class="mr-2" />
        <span>{{ $t('score', '得分') }}: {{ record.score }}</span>
        <span>{{ $t('start-time', '开始于') }}: {{ record.startTime }}</span>
        <span>{{ $t('end-time', '结束于') }}: {{ record.endTime }}</span>
        <span>{{ $t('using-time', '用时') }}: {{ record.durations }}</span>
      </li>
    </ul>
  </div>
</template>
