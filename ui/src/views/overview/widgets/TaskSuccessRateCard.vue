<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import gql from 'graphql-tag'
import { useQuery } from '@vue/apollo-composable'
import { TaskSuccessRate, TrendType } from '@/typed-graph'

const { t } = useI18n()

withDefaults(defineProps<{
  detailsLink?: string;
  timeRange?: string;
}>(), {
  detailsLink: '#',
  timeRange: '24h',
})

const { result, loading, refetch } = useQuery(gql`
  query TaskSuccessRate($name: String, $start: Time!, $end: Time!) {
    taskSuccessRate(name: $name, start: $start, end: $end) {
      total
      success
      successRate
    }
  }
  `, {
    start: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
    end: new Date()
}, {})

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
