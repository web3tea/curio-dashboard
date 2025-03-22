<script setup lang="ts">
import { useQuery } from '@vue/apollo-composable'
import { TrendType, TimeRangeType, MiningStatusSummay } from '@/typed-graph'
import { computed,  } from 'vue'
import { useI18n } from 'vue-i18n'
import { calculateStartTime } from '@/utils/helpers/startTime'
import { GetMiningStatusSummary } from '@/gql/mining'
import { useLocaleTimeAgo } from '@/utils/helpers/timeAgo'

const { t } = useI18n()

const props = withDefaults(defineProps<{
  detailsLink?: string;
  timeRange?: TimeRangeType;
}>(), {
  detailsLink: '#',
  timeRange: 'HOUR_24',
})

const end = computed(() => new Date())
const start = computed(() => {
  return calculateStartTime(props.timeRange, end.value)
})

interface MiningStatusData {
  total: number;
  won: number;
  included: number;
  orphan: number;
  lastWon: string;
  trend?: TrendType;
  trendValue?: string;
}

const { result, loading, refetch } = useQuery(GetMiningStatusSummary, {
  start: start.value,
  end: end.value
}, {
  pollInterval: 60000,
})

const item = computed<MiningStatusData>(() => {
  const sourceData: MiningStatusSummay = result.value?.miningStatusSummay || {}
  const wonChangeRate: number = sourceData.wonChangeRate != null
    ? (sourceData.wonChangeRate !== 0 && sourceData.wonChangeRate !== 100
      ? Number(sourceData.wonChangeRate.toFixed(2))
      : sourceData.wonChangeRate)
    : 0

  return {
    total: sourceData.total || 0,
    won: sourceData.won || 0,
    included: sourceData.included || 0,
    orphan:(sourceData.won || 0) - (sourceData.included || 0),
    lastWon: sourceData.lastMinedAt ? useLocaleTimeAgo(new Date(sourceData.lastMinedAt)).value : "N/A",
    trend: wonChangeRate > 0 ? "UP" : "DOWN",
    trendValue: `${wonChangeRate}%` ,
  }
})

defineExpose({
  refetch
})
</script>
<template>
  <DashboardCard
    :title="t('miningStatusCard.title')"
    :tooltip="t('miningStatusCard.tooltip')"
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
        <div class="text-h3 mr-1">
          {{ t('miningStatusCard.blocked') }}：
        </div>
        <div class="text-h3">
          {{ item.won }}
        </div>
      </div>
      <v-row class="mt-2">
        <v-col cols="12">
          <div class="d-flex justify-space-between align-center">
            <span class="text-body-2 text-grey">{{ t('miningStatusCard.included') }}:</span>
            <span class="text-subtitle-1 font-weight-bold">{{ item.included }}</span>
          </div>
          <div class="d-flex justify-space-between align-center">
            <span class="text-body-2 text-grey">{{ t('miningStatusCard.orphan') }}:</span>
            <span class="text-subtitle-1 font-weight-bold">{{ item.orphan }}</span>
          </div>
          <div class="d-flex justify-space-between align-center">
            <span class="text-body-2 text-grey">{{ t('miningStatusCard.lastWon') }}:</span>
            <span class="text-subtitle-1 font-weight-bold">{{ item.lastWon }}</span>
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
