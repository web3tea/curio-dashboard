<script setup lang="ts">

import { useQuery } from '@vue/apollo-composable'
import { GetTaskHistories } from '@/gql/task'
import { computed, ComputedRef, ref } from 'vue'
import { TaskHistory } from '@/typed-graph'
import { IconRefresh } from '@tabler/icons-vue'
import { useTableSettingsStore } from "@/stores/table"
import { getRelativeTime } from '@/utils/helpers/time'
import { formatDuration } from '@/utils/helpers/formatDuration'

const props = defineProps({
  start: {
    type: Date,
    default: undefined
  },
  end: {
    type: Date,
    default: undefined
  },
  name: {
    type: String,
    default: undefined
  },
  machine: {
    type: String,
    default: undefined
  },
  success: {
    type: Boolean,
    default: undefined,
  },
})

const tableSettings = useTableSettingsStore()

const start = ref<Date | undefined>(props.start)
const end = ref<Date | undefined>(props.end)
const name = ref<string | undefined>(props.name)
const machine = ref<string | undefined>(props.machine)
const success = ref<boolean | undefined>(props.success)
const limit = ref(100)
const page = ref(1)
const offset = computed(() => (page.value - 1) * limit.value)

const { result, loading, refetch } = useQuery(GetTaskHistories, {
  start,
  end,
  machine,
  name,
  result: success,
  offset,
  limit,
}, () => ({
  fetchPolicy: 'cache-first',
}))

const items: ComputedRef<[TaskHistory]> = computed(() => result.value?.taskHistories || [])
const itemsCount = computed<number>(() :number =>  {
  return result.value?.taskHistoriesCount || itemsCount.value || 0
})

const headers = [
  { title: 'ID', key: 'id' },
  { title: 'Task ID', key: 'taskId' },
  { title: 'Name', key: 'name', sortable: false },
  { title: 'Completed By', key: 'completedByHostAndPort', sortable: false },
  { title: 'Posted', key: 'posted' },
  { title: 'Start', key: 'workStart' },
  { title: 'Took', key: 'took', sortable: false },
  { title: 'Success', key: 'result', align: 'center' },
] as const

const selectDateRange = computed({
  get: () => [start.value, end.value].filter(Boolean),
  set: value => {
    if (value) {
      if (value.length === 1) {
        if (value[0]) {
          start.value = value[0]
          end.value = new Date(start.value.getTime() + 24 * 60 * 60 * 1000) // +1 day
        }
      } else {
        start.value = value[0]
        end.value = value[value.length - 1]
      }
    }
  },
})

</script>

<template>
  <v-row>
    <v-col
      cols="12"
      md="12"
    >
      <v-card
        class="bg-surface"
        elevation="0"
        variant="outlined"
      >
        <v-card-item>
          <v-row
            class="align-center"
            justify="space-between"
          >
            <v-col
              cols="12"
              md="9"
            >
              <v-row>
                <v-col
                  cols="4"
                  md="2"
                >
                  <TaskNameSelectInput v-model="name" />
                </v-col>
                <v-col
                  cols="4"
                  md="2"
                >
                  <HostPortSelectInput
                    v-model="machine"
                    label="Completed By"
                  />
                </v-col>
                <v-col
                  cols="6"
                  md="2"
                >
                  <BoolSelectInput
                    v-model="success"
                    true-title="Success"
                    false-title="Failure"
                  />
                </v-col>
                <v-col
                  cols="6"
                  md="3"
                >
                  <DateRangeSelectInput
                    v-model="selectDateRange"
                    label="Date Range"
                  />
                </v-col>
              </v-row>
            </v-col>
            <v-col
              cols="12"
              md="3"
            >
              <div class="d-flex ga-2 justify-end">
                <v-btn
                  :icon="IconRefresh"
                  rounded
                  variant="text"
                  @click="refetch"
                />
              </div>
            </v-col>
          </v-row>
        </v-card-item>
        <v-divider />
        <v-card-text class="pa-0">
          <v-data-table-server
            v-model:items-per-page="tableSettings.itemsPerPage"
            v-model:page="page"
            :fixed-header="tableSettings.fixedHeader"
            :headers="headers"
            height="calc(100vh - 300px)"
            :hover="tableSettings.hover"
            :items="items"
            :items-length="itemsCount"
            :loading="loading"
            :items-per-page-options="tableSettings.itemsPerPageOptions"
          >
            <template #item.completedByHostAndPort="{ value }">
              <RouterLink
                :to="{ name: 'MachineInfo', params: { id: value } }"
              >
                {{ value }}
              </RouterLink>
            </template>

            <template #item.name="{ value }">
              <RouterLink :to="{ name: 'TaskHistory', query: { name: value } }">
                {{ value }}
              </RouterLink>
            </template>

            <template #item.posted="{ value }">
              {{ getRelativeTime(value, "long") }}
            </template>
            <template #item.workStart="{ value }">
              {{ getRelativeTime(value, "long") }}
            </template>
            <template #item.took="{ item }">
              {{ formatDuration(new Date(item.workEnd).getTime() - new Date(item.workStart).getTime()) }}
            </template>
            <template #item.result="{ item }">
              <StatusIcon
                :status="item.result ? 'success': 'failure'"
                :tooltip="item.result ? 'Success': item.err || 'Failure'"
              />
            </template>
          </v-data-table-server>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
