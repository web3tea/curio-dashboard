<script setup lang="ts">
import { useQuery } from '@vue/apollo-composable'
import { GetStorageStats } from '@/gql/storage'
import { computed, ComputedRef } from 'vue'
import { StorageStats, TrendType } from '@/typed-graph'
import { useI18n } from 'vue-i18n'
import { formatBytes } from '@/utils/helpers/formatBytes'

withDefaults(defineProps<{
  detailsLink?: string;
  timeRange?: string;
}>(), {
  detailsLink: '#',
  timeRange: '24h',
})

const { t } = useI18n()

interface StorageUsedData {
  total: number;
  available: number;
  usedRate: number;
  trend?: TrendType;
  trendValue?: string;
}

const { result, loading, refetch } = useQuery(GetStorageStats, null, {})

const items: ComputedRef<[StorageStats]> = computed(() => result.value?.storageStats || [])

const item = computed<StorageUsedData>(() => {
  const validItems = items.value?.filter(item => item.type === 'Store' || item.type === 'Hybrid') || []

  const stats = validItems.reduce((acc, item) => ({
    total: acc.total + (item.totalCapacity || 0),
    available: acc.available + (item.totalAvailable || 0)
  }), { total: 0, available: 0 })

  const usedRate = stats.total > 0
    ? Math.round(((stats.total - stats.available) / stats.total) * 100)
    : 0

  return {
    ...stats,
    usedRate: usedRate+80,
    trend: usedRate > 80 ? "WARNING" : "GOOD",
  }
})

defineExpose({
  refetch
})

</script>

<template>
  <DashboardCard
    :title="t('storageUsedCard.title')"
    :tooltip="t('storageUsedCard.tooltip')"
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
        {{ item.usedRate }}%
      </div>
      <v-row class="mt-4">
        <v-col cols="12">
          <v-progress-linear
            v-model="item.usedRate"
            color="primary"
            rounded
          />
        </v-col>
      </v-row>
      <v-row class="mt-2">
        <v-col
          cols="12"
          class="text-center"
        >
          <div class="text-caption">
            <span>{{ formatBytes(item.total - item.available).combined }} </span> /
            {{ formatBytes(item.total).combined }}
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
