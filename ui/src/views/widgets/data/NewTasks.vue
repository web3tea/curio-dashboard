<script setup lang="ts">
import { ref, watch } from 'vue'
import { useSubscription } from '@vue/apollo-composable'
import { SubscribeNewTask } from '@/gql/task'
import { Task } from '@/typed-graph'
import { IconPlayerPause, IconPlayerPlay } from '@tabler/icons-vue'
import { useI18n } from 'vue-i18n'
import { getRelativeTime } from '@/utils/helpers/time'

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

const { t } = useI18n()

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
  <UiWidgetCard
    class-name="px-0 pb-0 rounded-md"
    :title="t('fields.New Added Tasks')"
  >
    <template #append>
      <v-btn
        :icon="isStop ? IconPlayerPlay : IconPlayerPause"
        rounded
        variant="text"
        @click="isStop = !isStop; isStop ? stop() : start()"
      />
    </template>
    <template #subtitle>
      <router-link :to="{name: 'ActiveTasks'}">
        {{ t('fields.View All') }}
      </router-link>
    </template>
    <v-data-table-virtual
      fixed-header
      :headers="headers"
      hover
      :items="tasks"
      :loading="loading"
    >
      <template #item.name="{ value }">
        <router-link :to="{ name: 'TaskHistory', query: { name: value } }">
          {{ value }}
        </router-link>
      </template>
      <template #item.postedTime="{ value }">
        {{ getRelativeTime(value) }}
      </template>
      <template #item.addedBy="{ item }">
        <RouterLink :to="{ name: 'MachineInfo', params: { id: item.addedBy.id } }">
          {{ item.addedBy.hostAndPort }}
        </RouterLink>
      </template>
    </v-data-table-virtual>
  </UiWidgetCard>
</template>
