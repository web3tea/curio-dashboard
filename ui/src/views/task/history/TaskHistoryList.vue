<script setup lang="ts">

import { useQuery } from '@vue/apollo-composable'
import { GetTaskHistories } from '@/gql/task'
import { computed, ComputedRef, ref } from 'vue'
import { TaskHistory } from '@/typed-graph'
import { IconReload } from '@tabler/icons-vue'

const props = defineProps({
  start: {
    type: Date,
  },
  end: {
    type: Date,
  },
  name: {
    type: String,
  },
  machine: {
    type: String,
  },
  success: {
    type: Boolean,
    default: undefined,
  },
})

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
const itemsCount = computed<number>({
  get: (): number => {
    return result.value?.taskHistoriesCount || itemsCount.value || 0
  },
  set: () => {},
})

const headers = [
  { title: 'ID', key: 'id' },
  { title: 'Task ID', key: 'taskId' },
  { title: 'Name', key: 'name', sortable: false },
  { title: 'Completed By', key: 'completedByHostAndPort', sortable: false },
  { title: 'Posted', key: 'posted' },
  { title: 'Work Start', key: 'workStart' },
  { title: 'Work End', key: 'workEnd' },
  { title: 'Success', key: 'result' },
  { title: 'Error', key: 'err' },
]

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
    <v-col cols="12" md="12">
      <v-card class="bg-surface" elevation="0" variant="outlined">
        <v-card-item>
          <v-row class="align-center" justify="space-between">
            <v-col cols="12" md="9">
              <v-row>
                <v-col cols="4" md="2">
                  <TaskNameSelectInput v-model="name" />
                </v-col>
                <v-col cols="4" md="2">
                  <HostPortSelectInput v-model="machine" label="Completed By" />
                </v-col>
                <v-col cols="6" md="2">
                  <BoolSelectInput v-model="success" label="Success" />
                </v-col>
                <v-col cols="6" md="3">
                  <DateRangeSelectInput v-model="selectDateRange" label="Date Range" />
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" md="3">
              <div class="d-flex ga-2 justify-end">
                <v-btn
                  :icon="IconReload"
                  round
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
            v-model:items-per-page="limit"
            v-model:page="page"
            fixed-header
            :headers="headers"
            height="calc(100vh - 280px)"
            hover
            :items="items"
            :items-length="itemsCount"
            :loading="loading"
          >
            <template #item.posted="{ value }">
              {{ $d(value, 'long') }}
            </template>
            <template #item.workStart="{ value }">
              {{ $d(value, 'long') }}
            </template>
            <template #item.workEnd="{ value }">
              {{ $d(value, 'long') }}
            </template>
          </v-data-table-server>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>

</template>
