<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useQuery } from '@vue/apollo-composable'
import { RouteLocationRaw } from 'vue-router'
import { TaskSuccessRate, TrendType,TimeRangeType  } from '@/typed-graph'
import { GetTaskSuccessRate } from '@/gql/task'
import { calculateStartTime } from '@/utils/helpers/startTime'

const { t } = useI18n()

const props = defineProps({
  detailsLink: {
    type: Object as () => RouteLocationRaw,
    default: () => ({ name: 'TaskHistory', query: { success: false } }),
  },
  timeRange: {
    type: String as () => TimeRangeType,
    default: 'HOUR_24'
  }
})

const end = computed(() => new Date())
const start = computed(() => {
  return calculateStartTime(props.timeRange, end.value)
})

const { result, loading, refetch } = useQuery(GetTaskSuccessRate, {
  start: start.value,
  end: end.value,
}, {
  pollInterval: 600000,
})

interface TaskSuccessRateData {
  total: number;
  success: number;
  successRate: number;
  failed: number;
  trend?: TrendType;
  trendValue?: string;
}

const item = computed<TaskSuccessRateData>(() => {
  const sourceData: TaskSuccessRate = result.value?.taskSuccessRate || {}
  const successRate = sourceData.successRate != null
    ? (sourceData.successRate !== 0 && sourceData.successRate !== 100
      ? Number(sourceData.successRate.toFixed(2))
      : sourceData.successRate)
    : 0

  return {
    total: sourceData.total || 0,
    success: sourceData.success || 0,
    successRate: successRate,
    failed: (sourceData.total || 0) - (sourceData.success || 0),
    trend: successRate < 95 ? "WARNING" : "NORMAL",
    trendValue: successRate < 95 ? undefined: t('common.stable'),
  }
})

defineExpose({
  refetch
})
</script>

<template>
  <DashboardCard
    :title="t('taskSuccessRate.title')"
    :tooltip="t('taskSuccessRate.tooltip')"
    :details-link="detailsLink"
    :details-text="t('common.viewDetails')"
    :trend="item.trend"
    :trend-value="item.trendValue"
  >
    <div
      v-if="!loading"
      class="text-center"
    >
      <div class="text-h2 font-weight-bold">
        {{ item.successRate }}%
      </div>
      <v-row class="mt-4">
        <v-col
          cols="6"
          class="text-center"
        >
          <div class="text-caption">
            <span class="text-grey">{{ t('taskSuccessRate.success') }}: </span>
            <span>{{ item.success }}</span>
          </div>
        </v-col>
        <v-col
          cols="6"
          class="text-center"
        >
          <div class="text-caption">
            <span class="text-grey">{{ t('taskSuccessRate.failed') }}: </span>
            <span>{{ item.failed }}</span>
          </div>
        </v-col>
      </v-row>
    </div>
    <div
      v-else
      class="text-center py-4"
    >
      <v-progress-circular
        indeterminate
        color="primary"
      />
      <div class="mt-2 text-caption">
        {{ t('common.loading') }}
      </div>
    </div>
  </dashboardcard>
</template>
