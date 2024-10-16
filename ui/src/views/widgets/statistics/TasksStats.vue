<script setup lang="ts">

import { useQuery } from '@vue/apollo-composable'
import { GetTasksStats } from '@/views/query/task'
import { computed, ComputedRef } from 'vue'
import { TaskStats } from '@/typed-graph'
import UiTitleCard from '@/components/shared/UiTitleCard.vue'
import { IconReload } from '@tabler/icons-vue'

const props = defineProps({
  machine: String,
  lastHours: {
    type: Number,
    default: 24,
  },
})
const currentEnd = new Date()
const currentStart = new Date(currentEnd.getTime() - props.lastHours * 60 * 60 * 1000)

const { result, refetch, loading } = useQuery(GetTasksStats, {
  machine: props.machine,
  end: currentEnd,
  start: currentStart,
})

const items: ComputedRef<TaskStats[]> = computed(() => result.value?.tasksStats || [])

const failedPercentage = (item: TaskStats) => {
  const total = item.success + item.failure
  return item.failure > 0 ? ((item.failure / total) * 100).toFixed(2) + '%' : '0%'
}
</script>

<template>
  <UiTitleCard class-name="px-0 pb-0 rounded-md" title="24H Task Counts">
    <template #action>
      <v-btn
        :disabled="loading"
        round
        :rounded="true"
        variant="text"
        @click="refetch"
      >
        <IconReload />
      </v-btn>
    </template>
    <v-table class="bordered-table" density="comfortable" hover>
      <thead class="bg-containerBg">
        <tr>
          <th class="text-left text-caption font-weight-bold text-uppercase">Task</th>
          <th class="text-left text-caption font-weight-bold text-uppercase">Success</th>
          <th class="text-left text-caption font-weight-bold text-uppercase">Failure</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.name">
          <td class="py-3">
            {{ item.name }}
          </td>
          <td class="py-3">{{ item.success }}</td>
          <td class="py-3">{{ item.failure }}  ({{ failedPercentage(item) }})</td>
        </tr>
      </tbody>
    </v-table>
  </UiTitleCard>
</template>

<style scoped lang="scss">

</style>
