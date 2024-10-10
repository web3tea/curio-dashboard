<script setup lang="ts">
import { ref, watch } from 'vue'

import UiTitleCard from '@/components/shared/UiTitleCard.vue'
import { useSubscription } from '@vue/apollo-composable'
import { SubscribeCompletedTask } from '@/views/query/task'
import { TaskHistory } from '@/typed-graph'
import moment from 'moment'
import { formatDuration } from '@/utils/helpers/formatDuration'
import { IconPlayerPause, IconPlayerPlay } from '@tabler/icons-vue'

const props = defineProps({
  maxMessages: {
    type: Number,
    default: 10,
  },
  host: {
    type: String,
    default: null,
  },
})

const isStop = ref(false)
const { result, loading, stop, start, error } = useSubscription(SubscribeCompletedTask, {
  last: props.maxMessages,
  host: props.host,
})

const tasks = ref<TaskHistory[]>([])

watch(
  result,
  data => {
    if (tasks.value.length >= props.maxMessages) {
      tasks.value.pop()
    }
    tasks.value.unshift(data.completedTask)
  },
)

const headers = [
  { text: 'Name', value: 'name' },
  { text: 'ID', value: 'taskId' },
  { text: 'Machine', value: 'completedByHostAndPort' },
  { text: 'Posted', value: 'posted' },
  { text: 'Start', value: 'workStart' },
  { text: 'Queued', value: 'queued' },
  { text: 'Took', value: 'took' },
  { text: 'Result', value: 'result' },
  { text: 'Error', value: 'err' },
]
const themeColor = ref('rgb(var(--v-theme-primary))')

</script>

<template>
  <UiTitleCard class-name="px-0 pb-0 rounded-md" title="Recently Finished Tasks">
    <template #action>
      <v-btn
        :icon="isStop ? IconPlayerPlay : IconPlayerPause"
        round
        :rounded="true"
        variant="text"
        @click="isStop = !isStop; isStop ? stop() : start()"
      />
    </template>
    <EasyDataTable
      :headers="headers"
      hide-footer
      :items="tasks"
      :loading="loading"
      :rows-per-page="100"
      table-class-name="customize-table"
      :theme-color="themeColor"
    >
      <template #empty-message>
        <p class="text-high-emphasis">{{ error?.message || 'No Data' }} </p>
      </template>
      <template #item-posted="{posted}">
        {{ moment(posted).calendar() }}
      </template>
      <template #item-workStart="{workStart}">
        {{ moment(workStart).calendar() }}
      </template>
      <template #item-completedByHostAndPort="{completedByHostAndPort, completedBy }">
        <RouterLink v-if="completedBy" :to="{ name: 'MachineInfo', params: { id: completedBy.id } }">{{ completedBy.hostAndPort }}</RouterLink>
        <span v-else>{{ completedByHostAndPort }}</span>
      </template>
      <template #item-queued="{posted, workStart}">
        {{ formatDuration(new Date(workStart).getTime() - new Date(posted).getTime()) }}
      </template>
      <template #item-took="{workStart, workEnd}">
        {{ formatDuration(new Date(workEnd).getTime() - new Date(workStart).getTime()) }}
      </template>
      <template #item-result="{ result }">
        <v-chip class="px-0" size="small" variant="text">
          <v-avatar class="mr-2" :color=" result ? 'success' : 'error'" size="8" variant="flat" />
          <p class="text-h6 mb-0">{{ result ? 'success' : 'failure' }}</p>
        </v-chip>
      </template>
    </EasyDataTable>
  </UiTitleCard>
</template>
