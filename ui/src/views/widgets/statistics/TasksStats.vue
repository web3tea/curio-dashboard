<script setup lang="ts">
import { useQuery } from '@vue/apollo-composable'
import { GetTasksStats } from '@/gql/task'
import { computed, ComputedRef } from 'vue'
import { TaskStats } from '@/typed-graph'
import UiTitleCard from '@/components/shared/UiTitleCard.vue'
import { IconReload } from '@tabler/icons-vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  machine: {
    type: String,
    default: undefined
  },
  lastHours: {
    type: Number,
    default: 24,
  },
})

const { t } = useI18n()

const currentEnd = new Date()
const currentStart = new Date(currentEnd.getTime() - props.lastHours * 60 * 60 * 1000)

const { result, refetch, loading } = useQuery(GetTasksStats, {
  machine: props.machine,
  end: currentEnd,
  start: currentStart,
})

const headers = [
  { title: 'Task', key: 'name' },
  { title: 'Success', key: 'success' },
  { title: 'Failure', key: 'failure' },
]

const items: ComputedRef<TaskStats[]> = computed(() => result.value?.tasksStats || [])

const failedPercentage = (item: TaskStats) => {
  const total = item.success + item.failure
  return item.failure > 0 ? ((item.failure / total) * 100) : 0
}
</script>

<template>
  <UiTitleCard
    class-name="px-0 pb-0 rounded-md"
    :title="t('fields.24H Task Counts')"
  >
    <template #action>
      <v-btn
        :disabled="loading"
        :icon="IconReload"
        rounded
        variant="text"
        @click="refetch"
      />
    </template>
    <v-data-table-virtual
      fixed-header
      :headers="headers"
      height="600"
      hover
      :items="items"
      :loading="loading"
    >
      <template #item.failure="{item}">
        <p :style="{ color: failedPercentage(item) > 80 ? 'red' : failedPercentage(item) > 30 ? 'yellow' : 'inherit' }">
          {{ item.failure }} ({{ failedPercentage(item).toFixed(2) }}%)
        </p>
      </template>
    </v-data-table-virtual>
  </UiTitleCard>
</template>

<style scoped lang="scss">

</style>
