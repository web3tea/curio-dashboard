<script setup lang="ts">
import { useQuery } from '@vue/apollo-composable'
import { GetTaskHistoriesCount } from '@/gql/task'
import { IconSubtask } from '@tabler/icons-vue'
import { computed } from 'vue'

const props = defineProps({
  machine: {
    type: String,
    default: undefined
  },
  name: {
    type: String,
    default: undefined
  },
  lastHours: {
    type: Number,
    default: 24,
  },
})

const currentEnd = new Date()
const currentStart = new Date(currentEnd.getTime() - props.lastHours * 60 * 60 * 1000)

const { result: current } = useQuery(GetTaskHistoriesCount, {
  machine: props.machine,
  name: props.name,
  end: currentEnd,
  start: currentStart,
})

const { result: failed } = useQuery(GetTaskHistoriesCount, {
  machine: props.machine,
  name: props.name,
  success: false,
  end: currentEnd,
  start: currentStart,
})

const card = computed(() => ({
  name: 'Completed Tasks' + ` (${props.lastHours}h)`,
  current: current.value?.taskHistoriesCount || 0,
  failed: failed.value?.taskHistoriesCount || 0,
  failedRate: ((failed.value?.taskHistoriesCount / current.value?.taskHistoriesCount) * 100),
}))

</script>

<template>
  <v-card elevation="0">
    <v-card variant="outlined">
      <v-card-text>
        <div class="d-flex align-items-center justify-space-between">
          <div>
            <h5 class="text-h5">
              {{ $t('fields.Tasks Completed') }}
            </h5>
            <h3 class="text-h3 my-2">
              {{ card.current }}
            </h3>
            <h6 class="text-caption font-weight-medium mb-0">
              {{ $d(currentStart, 'short') }} - {{ $d(currentEnd, 'short') }}
            </h6>
          </div>
          <span class="d-flex align-center">
            <v-btn
              :icon="IconSubtask"
              rounded="md"
              size="small"
              :to="{ name: 'TaskHistory', query: { machine: props.machine, name: props.name, start: currentStart.getTime(), end: currentEnd.getTime() } }"
              variant="flat"
            />
          </span>
        </div>
      </v-card-text>
    </v-card>
  </v-card>
</template>

<style scoped lang="scss">

</style>
