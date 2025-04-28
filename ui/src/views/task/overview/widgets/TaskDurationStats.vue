<script setup lang="ts">
import { GetTasksDurationStats } from '@/gql/task'
import { TaskDurationStats } from '@/typed-graph'
import { useQuery } from '@vue/apollo-composable'
import { ComputedRef, computed, ref } from 'vue'
import { IconRefresh } from '@tabler/icons-vue'
import { useI18n } from 'vue-i18n'
import { formatDurationSeconds } from '@/utils/helpers/formatDuration'

const props = defineProps({
  start: {
    type: Date,
    required: false,
    default: () => new Date(Date.now() - 24 * 60 * 60 * 1000) // 24 hours ago
  },
  end: {
    type: Date,
    required: false,
    default: () => new Date()
  },
  height: {
    type: String,
    required: false,
    default: undefined
  }
})
const { t } = useI18n()
const search = ref<string>()

const { result, loading, refetch } = useQuery(GetTasksDurationStats, {
  start: props.start,
  end: props.end
}, {})
const items: ComputedRef<[TaskDurationStats]> = computed(() => result.value?.tasksDurationStats || [])

const headers = [
  { title: 'Name', key: 'name' },
  { title: 'Total Tasks', key: 'totalTasks' },
  { title: 'Max', key: 'maxDurationSeconds' },
  { title: 'Min', key: 'minDurationSeconds' },
  { title: 'Avg', key: 'avgDurationSeconds' },
  { title: 'Median', key: 'medianDurationSeconds' },
  { title: 'P90', key: 'p90DurationSeconds' },
  { title: 'P95', key: 'p95DurationSeconds' },
  { title: 'P99', key: 'p99DurationSeconds' },
]
const sortBy = [{ key: 'p99DurationSeconds', order: 'desc' }] as const

</script>

<template>
  <UiWidgetCard
    class-name="px-0 pb-0 rounded-md"
    :title="t('fields.Task Duration Stats')"
  >
    <template #append>
      <v-btn
        :disabled="loading"
        :icon="IconRefresh"
        rounded
        variant="text"
        @click="refetch"
      />
    </template>
    <v-data-table-virtual
      density="compact"
      fixed-header
      hover
      :headers="headers"
      :items="items"
      :loading="loading"
      :search="search"
      :height="height"
      :sort-by="sortBy"
    >
      <template #item.name="{ value }">
        <RouterLink
          :to="{ name: 'TaskHistory', query: { name: value } }"
        >
          {{ value }}
        </RouterLink>
      </template>
      <template #item.maxDurationSeconds="{ item }">
        {{ formatDurationSeconds(item.maxDurationSeconds) }}
      </template>
      <template #item.minDurationSeconds="{ item }">
        {{ formatDurationSeconds(item.minDurationSeconds) }}
      </template>
      <template #item.avgDurationSeconds="{ item }">
        {{ formatDurationSeconds(item.avgDurationSeconds) }}
      </template>
      <template #item.medianDurationSeconds="{ item }">
        {{ formatDurationSeconds(item.medianDurationSeconds) }}
      </template>
      <template #item.p90DurationSeconds="{ item }">
        {{ formatDurationSeconds(item.p90DurationSeconds) }}
      </template>
      <template #item.p95DurationSeconds="{ item }">
        {{ formatDurationSeconds(item.p95DurationSeconds) }}
      </template>
      <template #item.p99DurationSeconds="{ item }">
        {{ formatDurationSeconds(item.p99DurationSeconds) }}
      </template>
    </v-data-table-virtual>
  </UiWidgetCard>
</template>
