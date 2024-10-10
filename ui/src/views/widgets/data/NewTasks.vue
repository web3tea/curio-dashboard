<script setup lang="ts">
import { ref, watch } from 'vue'

import UiTitleCard from '@/components/shared/UiTitleCard.vue'
import { useSubscription } from '@vue/apollo-composable'
import { SubscribeNewTask } from '@/views/query/task'
import { Task } from '@/typed-graph'
import moment from 'moment'
import { IconPlayerPause, IconPlayerPlay } from '@tabler/icons-vue'

const props = defineProps({
  maxLen: {
    type: Number,
    default: 10,
  },
  machineID: {
    type: Number,
    default: null,
  },
})

const isStop = ref(false)
const { result, loading, stop, start, error } = useSubscription(SubscribeNewTask, {
  last: props.maxLen,
  machineID: props.machineID,
})

const tasks = ref<Task[]>([])

watch(
  result,
  data => {
    if (tasks.value.length >= props.maxLen) {
      tasks.value.pop()
    }
    tasks.value.unshift(data.newTask)
  },
)

const headers = [
  { text: 'Name', value: 'name' },
  { text: 'ID', value: 'id' },
  { text: 'Posted', value: 'postedTime' },
  { text: 'AddedBy', value: 'addedBy' },
]
const themeColor = ref('rgb(var(--v-theme-primary))')

</script>

<template>
  <UiTitleCard class-name="px-0 pb-0 rounded-md" title="New Added Tasks">
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
      <template #item-postedTime="{postedTime}">
        {{ moment(postedTime).calendar() }}
      </template>
      <template #item-addedBy="{addedBy}">
        <RouterLink :to="{ name: 'MachineInfo', params: { id: addedBy.id } }">{{ addedBy.hostAndPort }}</RouterLink>
      </template>
    </EasyDataTable>
  </UiTitleCard>
</template>
