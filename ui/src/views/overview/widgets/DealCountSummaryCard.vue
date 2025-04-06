<script setup lang="ts">
import { useQuery } from '@vue/apollo-composable'
import { TrendType } from '@/typed-graph'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouteLocationRaw } from 'vue-router'
import { GetDealCountSummary } from '@/gql/deal'

defineProps({
  detailsLink: {
    type: Object as () => RouteLocationRaw,
    default: () => ({ name: 'MarketMk12Deals' }),
  }
})

const { t } = useI18n()

interface DealCountSummaryData {
  total: number;
  boost: number;
  direct: number;
  legacy: number;
  trend?: TrendType;
  trendValue?: string;
}

const { result, loading, refetch } = useQuery(GetDealCountSummary, null, {
  pollInterval: 60000,
})

const item = computed<DealCountSummaryData>(() => {
  if (!result.value?.marketDealCountSummary) {
    return {
      total: 0,
      boost: 0,
      direct: 0,
      legacy: 0,
      trend: 'UP',
      trendValue: '0%', // todo:
    }
  }
  const { boost, direct, legacy } = result.value.marketDealCountSummary
  const total = boost + direct + legacy

  return {
    total,
    boost,
    direct,
    legacy,
    trend: 'UP',
    trendValue: '0%', // todo:
  }
})

defineExpose({
  refetch
})
</script>

<template>
  <DashboardCard
    :title="t('dealCountSummary.title')"
    :tooltip="t('dealCountSummary.tooltip')"
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
        <div class="text-h2 font-weight-bold mr-2">
          {{ item.total }}
        </div>
        <div class="text-subtitle-2 mt-3">
          {{ t('common.deal', item.total) }}
        </div>
      </div>
      <v-row class="mt-2">
        <v-col cols="12">
          <div class="d-flex justify-space-between align-center">
            <span class="text-body-2 text-grey">{{ t('dealCountSummary.boost') }}:</span>
            <span class="text-subtitle-1 font-weight-bold">{{ item.boost }}</span>
          </div>
          <div class="d-flex justify-space-between align-center">
            <span class="text-body-2 text-grey">{{ t('dealCountSummary.direct') }}:</span>
            <span class="text-subtitle-1 font-weight-bold">{{ item.direct }}</span>
          </div>
          <div class="d-flex justify-space-between align-center">
            <span class="text-body-2 text-grey">{{ t('dealCountSummary.lagacy') }}:</span>
            <span class="text-subtitle-1 font-weight-bold">{{ item.legacy }}</span>
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
