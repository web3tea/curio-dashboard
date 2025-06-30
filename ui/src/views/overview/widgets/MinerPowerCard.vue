<script setup lang="ts">
import { useQuery } from '@vue/apollo-composable'
import { computed, ref, onActivated, onDeactivated } from 'vue'
import { useI18n } from 'vue-i18n'
import { MinerPower } from '@/typed-graph'
import { GetMinerPower } from '@/gql/miner'
import { RouteLocationRaw } from 'vue-router'
import { TrendType } from '@/typed-graph'
import { formatBytes } from '@/utils/helpers/formatBytes'

defineProps({
  detailsLink: {
    type: Object as () => RouteLocationRaw,
    default: () => ({ name: 'Miners' }),
  },
})

const { t } = useI18n()

const enabled = ref(true)

const { result, loading, refetch } = useQuery(GetMinerPower, null, () => ({
  enabled: enabled.value,
  pollInterval: 60000,
}))

onActivated(() => {
  enabled.value = true
})

onDeactivated(() => {
  enabled.value = false
})

// const minerPower: ComputedRef<MinerPower> = computed(() => result.value?.minerPower || {})

interface MinerPowerData {
  minerQaPower: string;
  minerRawPower: string;
  totalQaPower: string;
  totalRawPower: string;

  trend?: TrendType;
  trendValue?: string;
}

const item = computed<MinerPowerData>(() => {
  const sourceData: MinerPower = result.value?.minerPower
  if (!sourceData) {
    return {
      minerQaPower: '0',
      minerRawPower: '0',
      totalQaPower: '0',
      totalRawPower: '0',
      trend: 'WARNING',
    }
  }
  return {
    minerQaPower: formatBytes(sourceData.minerPower.qualityAdjPower || '0').combined,
    minerRawPower: formatBytes(sourceData.minerPower.rawBytePower || '0').combined,
    totalQaPower: formatBytes(sourceData.totalPower.qualityAdjPower || '0').combined,
    totalRawPower: formatBytes(sourceData.totalPower.rawBytePower || '0').combined,
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
    :title="t('minerpowerCard.title')"
    :tooltip="t('minerpowerCard.tooltip')"
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
          {{ item.minerQaPower }}
        </div>
      </div>
      <v-row class="mt-2">
        <v-col cols="12">
          <div class="d-flex justify-space-between align-center">
            <span class="text-body-2 text-grey">{{ t('minerpowerCard.minerRawPower') }}:</span>
            <span class="text-subtitle-1 font-weight-bold">{{ item.minerRawPower }}</span>
          </div>
          <div class="d-flex justify-space-between align-center">
            <span class="text-body-2 text-grey">{{ t('minerpowerCard.totalPower') }}:</span>
            <span class="text-subtitle-1 font-weight-bold">{{ item.totalQaPower }}</span>
          </div>
          <div class="d-flex justify-space-between align-center">
            <span class="text-body-2 text-grey">{{ t('minerpowerCard.totalRawPower') }}:</span>
            <span class="text-subtitle-1 font-weight-bold">{{ item.totalRawPower }}</span>
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
