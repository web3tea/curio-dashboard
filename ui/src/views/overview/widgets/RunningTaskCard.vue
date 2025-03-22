<script setup lang="ts">
import { useQuery } from '@vue/apollo-composable'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { RunningTaskSummary, TrendType } from '@/typed-graph'
import { GetRunningTaskSummary } from '@/gql/task'
import { formatDuration } from '@/utils/helpers/formatDuration'

withDefaults(defineProps<{
  detailsLink?: string;
}>(), {
  detailsLink: '#',
})

const { t } = useI18n()

const { result, loading, refetch } = useQuery(GetRunningTaskSummary, null, {
  pollInterval: 3000,
})

interface RunningTaskData {
  running: number;
  queued: number;
  averageWaitTime: string;
  trend?: TrendType;
  trendValue?: string;
}

const item = computed<RunningTaskData>(() => {
  const sourceData: RunningTaskSummary = result.value?.runningTaskSummary || {}
  return {
    running: sourceData.running || 0,
    queued: sourceData.queued || 0,
    averageWaitTime: formatDuration( sourceData.averageWaitTime * 1000 || 0),
    trend: 'UP', // todo:
    trendValue: '1%', // todo:
  }
})
defineExpose({
  refetch
})
</script>
<template>
  <DashboardCard
    :title="t('runningTaskCard.title')"
    :tooltip="t('runningTaskCard.tooltip')"
    :details-link="detailsLink"
    :details-text="t('common.viewDetails')"
    :trend="item.trend"
    :trend-value="item.trendValue"
  >
    <div
      v-if="!loading"
      class="text-center"
    >
      <div class="d-flex align-items-end justify-center">
        <div class="text-h3">
          {{ item.running }}
        </div>
      </div>
      <v-row class="mt-2">
        <v-col cols="12">
          <div class="d-flex justify-space-between align-center">
            <span class="text-body-2 text-grey">{{ t('runningTaskCard.queued') }}:</span>
            <span class="text-subtitle-1 font-weight-bold">{{ item.queued }}</span>
          </div>
          <div class="d-flex justify-space-between align-center">
            <span class="text-body-2 text-grey">{{ t('runningTaskCard.averageWaitTime') }}:</span>
            <span class="text-subtitle-1 font-weight-bold">{{ item.averageWaitTime }}</span>
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
