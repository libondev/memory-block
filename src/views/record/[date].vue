<script lang="ts" setup>
import type { RecordItem } from '@/composables/use-local-cache'
import { getTargetDateRecords } from '@/composables/use-local-cache'

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
        <Tag :level="record.level" class="mr-2" />
        <span>得分: {{ record.score }}</span>
        <span>开始于: {{ record.startTime }}</span>
        <span>结束于: {{ record.endTime }}</span>
        <span>用时: {{ record.durations }}</span>
      </li>
    </ul>
  </div>
</template>
