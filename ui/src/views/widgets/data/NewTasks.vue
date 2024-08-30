<script setup lang="ts">
import { ref, watch } from 'vue'

import UiTitleCard from '@/components/shared/UiTitleCard.vue'
import { useSubscription } from '@vue/apollo-composable'
import { SubscribeNewTask } from '@/views/query/task'
import { Task } from '@/typed-graph'
import moment from 'moment'

const maxLen = 10
const { result } = useSubscription(SubscribeNewTask, {
  last: maxLen,
})

const tasks = ref<Task[]>([])

watch(
  result,
  data => {
    if (tasks.value.length >= maxLen) {
      tasks.value.pop()
    }
    tasks.value.unshift(data.newTask)
  },
)

const headers = [
  { text: 'Name', value: 'name' },
  { text: 'ID', value: 'id' },
  { text: 'Posted', value: 'postedTime' },
  { text: 'AddedBy', value: 'addedByID' },
]
const themeColor = ref('rgb(var(--v-theme-primary))')

</script>

<template>
  <UiTitleCard class-name="px-0 pb-0 rounded-md" title="New Added Tasks">
    <EasyDataTable
      :headers="headers"
      hide-footer
      :items="tasks"
      :rows-per-page="100"
      table-class-name="customize-table"
      :theme-color="themeColor"
    >
      <template #item-postedTime="{postedTime}">
        {{ moment(postedTime).calendar() }}
      </template>
    </EasyDataTable>
  </UiTitleCard>
</template>
