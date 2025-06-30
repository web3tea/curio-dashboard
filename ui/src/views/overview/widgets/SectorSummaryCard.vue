<script setup lang="ts">
import { useQuery } from '@vue/apollo-composable'
import { useI18n } from 'vue-i18n'
import { TrendType } from '@/typed-graph'
import { computed, ref, onActivated, onDeactivated } from 'vue'
import { RouteLocationRaw } from 'vue-router'
import { GetSectorSummary } from '@/gql/sector'

defineProps({
  detailsLink: {
    type: Object as () => RouteLocationRaw,
    default: () => ({ name: 'Sectors' }),
  }
})

const { t } = useI18n()

const enabled = ref(true)

interface SectorSummaryData {
  total: number;
  active: number;
  sealing: number;
  failed: number;
  trend?: TrendType;
  trendValue?: string;
}

const { result, loading, refetch } = useQuery(GetSectorSummary, null, () => ({
  enabled: enabled.value,
  pollInterval: 60000,
}))

onActivated(() => {
  enabled.value = true
})

onDeactivated(() => {
  enabled.value = false
})

const item = computed<SectorSummaryData>(() => {
  if (!result.value?.sectorSummary) {
    return {
      total: 0,
      active: 0,
      sealing: 0,
      failed: 0,
      trend: 'GOOD',
    }
  }
  const { active, sealing, failed } = result.value.sectorSummary
  const total = active + sealing + failed

  const trend = failed > 0 ? 'WARNING' : 'GOOD'

  return {
    total,
    active,
    sealing,
    failed,
    trend,
  }
})

defineExpose({
  refetch
})
</script>

<template>
  <DashboardCard
    :title="t('sectorSummary.title')"
    :tooltip="t('sectorSummary.tooltip')"
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
          {{ t('common.sector', item.total) }}
        </div>
      </div>
      <v-row class="mt-2">
        <v-col cols="12">
          <div class="d-flex justify-space-between align-center">
            <span class="text-body-2 text-grey">{{ t('sectorSummary.active') }}:</span>
            <span class="text-subtitle-1 font-weight-bold text-success">{{ item.active }}</span>
          </div>
          <div class="d-flex justify-space-between align-center">
            <span class="text-body-2 text-grey">{{ t('sectorSummary.sealing') }}:</span>
            <span class="text-subtitle-1 font-weight-bold text-primary">{{ item.sealing }}</span>
          </div>
          <div class="d-flex justify-space-between align-center">
            <span class="text-body-2 text-grey">{{ t('sectorSummary.failed') }}:</span>
            <span
              class="text-subtitle-1 font-weight-bold"
              :class="item.failed > 0 ? 'text-error' : 'text-grey'"
            >{{ item.failed }}</span>
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
