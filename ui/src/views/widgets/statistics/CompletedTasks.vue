<script setup lang="ts">
import { useQuery } from '@vue/apollo-composable'
import { GetTaskHistoriesCount } from '@/views/query/task'
import { computed } from 'vue'
import { FallOutlined, RiseOutlined } from '@ant-design/icons-vue'

const props = defineProps({
  machine: String,
  name: String,
  lastHours: {
    type: Number,
    default: 24,
  },
})

const currentEnd = new Date()
const currentStart = new Date(currentEnd.getTime() - props.lastHours * 60 * 60 * 1000)
const previousStart = new Date(currentStart.getTime() - props.lastHours * 60 * 60 * 1000)

const { result: current } = useQuery(GetTaskHistoriesCount, {
  machine: props.machine,
  name: props.name,
  end: currentEnd,
  start: currentStart,
})

const { result: previous } = useQuery(GetTaskHistoriesCount, {
  machine: props.machine,
  name: props.name,
  end: currentStart,
  start: previousStart,
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
  current: current.value?.taskHistoriesCount,
  previous: previous.value?.taskHistoriesCount,
  rate: (((current.value?.taskHistoriesCount / previous.value?.taskHistoriesCount) - 1) * 100),
  failed: failed.value?.taskHistoriesCount,
  failedRate: ((failed.value?.taskHistoriesCount / current.value?.taskHistoriesCount) * 100),
}))

const color = computed(() => Number(card.value.rate) < 0 ? 'error' : 'primary')

</script>

<template>
  <v-card elevation="0">
    <v-card variant="outlined">
      <v-card-text>
        <div class="d-flex align-items-center justify-space-between">
          <div>
            <h6 class="text-h6 text-lightText mb-1">{{ card.name }}</h6>
            <h4 class="text-h4 d-flex align-center mb-0">
              {{ card.current }}
              <v-chip
                :border="`solid thin opacity-50`"
                class="ml-2"
                :color="color"
                label
                size="small"
              >
                <template #prepend>
                  <component :is="card.rate < 0 ? FallOutlined: RiseOutlined" :class="'mr-1 text-' + color" :style="{ fontSize: '12px' }" />
                </template>
                {{ card.rate.toFixed(2) }} %
              </v-chip>
            </h4>
            <span class="text-lightText text-caption pt-5 d-block">Failed tasks in the past {{ lastHours }} hours:
              <span :class="'text-' + color">{{ card.failed || 0 }} tasks, {{ card.failed >0 ? card.failedRate.toFixed(2): 0 }}%</span>
            </span>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-card>
</template>

<style scoped lang="scss">

</style>
