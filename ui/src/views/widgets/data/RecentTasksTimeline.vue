<script setup lang="ts">
import { ref, watch } from 'vue'

import { useSubscription } from '@vue/apollo-composable'
import { TaskHistory } from '@/typed-graph'
import moment from 'moment'
import { IconCircleX, IconSquareCheck } from '@tabler/icons-vue'
import { SubscribeCompletedTask } from '@/views/query/task'
import { formatDuration } from '@/utils/helpers/formatDuration'

const maxMessages = 7
const { result } = useSubscription(SubscribeCompletedTask, {
  last: maxMessages,
})

const tasks = ref<TaskHistory[]>([])

watch(
  result,
  data => {
    if (tasks.value.length >= maxMessages) {
      tasks.value.pop()
    }
    tasks.value.unshift(data.completedTask)
  },
)

</script>

<template>
  <v-timeline class="my-1 custom-timeline timeline-icon-circle justify-start px-5" line-color="borderLight" side="end">
    <template v-for="task in tasks" :key="task.id">
      <v-timeline-item :dot-color="task.result ? 'success' : 'error'" fill-dot>
        <template #icon>
          <component :is="task.result ? IconSquareCheck : IconCircleX " :style="{ fontSize: '16px' }" />
        </template>
        <template #opposite>
          <span class="text-subtitle-2 text-medium-emphasis">{{ moment(task.workEnd).fromNow() }}</span>
        </template>
        <v-card elevation="0">
          <h6 class="text-subtitle-1 mb-0">
            {{ task.name }}
          </h6>
          <span class="text-caption text-lightText">
            <router-link class="text-primary link-hover" to="#">{{ task.completedByHostAndPort }}</router-link>
            completed in {{ formatDuration(new Date(task.workEnd).getTime() - new Date(task.workStart).getTime()) }}
          </span>
        </v-card>
      </v-timeline-item>
    </template>
  </v-timeline>
</template>
