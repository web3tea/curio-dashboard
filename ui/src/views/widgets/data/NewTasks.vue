<script setup lang="ts">
import { ref, watch } from 'vue'

import UiTitleCard from '@/components/shared/UiTitleCard.vue'
import { useSubscription } from '@vue/apollo-composable'
import { SubscribeNewTask } from '@/gql/task'
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
const { result, loading, stop, start } = useSubscription(SubscribeNewTask, {
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
  { title: 'Name', key: 'name' },
  { title: 'ID', key: 'id' },
  { title: 'Posted', key: 'postedTime' },
  { title: 'AddedBy', key: 'addedBy' },
]
</script>

<template>
  <UiTitleCard class-name="px-0 pb-0 rounded-md" :title="$t('fields.New Added Tasks')">
    <template #action>
      <v-btn
        :icon="isStop ? IconPlayerPlay : IconPlayerPause"
        round
        :rounded="true"
        variant="text"
        @click="isStop = !isStop; isStop ? stop() : start()"
      />
    </template>
    <v-data-table-virtual
      fixed-header
      :headers="headers"
      hover
      :items="tasks"
      :loading="loading"
    >
      <template #item.postedTime="{ item }">
        {{ moment(item.postedTime).calendar() }}
      </template>
      <template #item.addedBy="{ item }">
        <RouterLink :to="{ name: 'MachineInfo', params: { id: item.addedBy.id } }">{{ item.addedBy.hostAndPort }}</RouterLink>
      </template>
    </v-data-table-virtual>
  </UiTitleCard>
</template>
