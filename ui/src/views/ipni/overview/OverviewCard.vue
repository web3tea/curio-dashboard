<script setup lang="ts">
import { computed, ComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { IpniStats } from '@/typed-graph'
import {
  IconBroadcast,
  IconArrowNarrowUp,
  IconServerSpark,
  IconDatabaseSearch,
  IconProgress,
  IconArrowNarrowDown,
  IconMinus
} from '@tabler/icons-vue'

const { t } = useI18n()

const { result, loading } = useQuery(gql`
  query GetIpniStats {
    ipniStats {
      totalAdvertisements
      previousTotalAdvertisements
      providers
      previousProviders
      indexed
      previousIndexed
      skipped
      previousSkipped
      pendingTasks
      previousPendingTasks
    }
  }
`, null, () => ({
  fetchPolicy: 'cache-first',
}))

const stats: ComputedRef<IpniStats> = computed(() => result.value?.ipniStats || {})

// Calculate indexed percentage and its change
const indexedPercentage = computed(() => {
  const total = stats.value.indexed + stats.value.skipped
  if (total === 0) return 0
  return parseFloat(((stats.value.indexed / total) * 100).toFixed(1))
})

const previousIndexedPercentage = computed(() => {
  const total = stats.value.previousIndexed + stats.value.previousSkipped
  if (total === 0) return 0
  return Math.round((stats.value.previousIndexed / total) * 100)
})

const indexedPercentageChange = computed(() =>
  indexedPercentage.value - previousIndexedPercentage.value
)

// Calculate changes for other metrics
const advertisementChange = computed(() =>
  stats.value.totalAdvertisements - stats.value.previousTotalAdvertisements
)
const providerChange = computed(() =>
  stats.value.providers - stats.value.previousProviders
)
const pendingTasksChange = computed(() =>
  stats.value.pendingTasks - stats.value.previousPendingTasks
)
const indexedChange = computed(() =>
  stats.value.indexed - stats.value.previousIndexed
)

// Get trend data (icon and color) based on change value
const getTrendData = (change: number, isTaskMetric = false) => {
  // For task metrics, a decrease is positive
  const actualChange = isTaskMetric ? -change : change

  if (actualChange > 0) {
    return {
      icon: IconArrowNarrowUp,
      color: 'success'
    }
  } else if (actualChange < 0) {
    return {
      icon: IconArrowNarrowDown,
      color: 'error'
    }
  } else {
    return {
      icon: IconMinus,
      color: 'grey'
    }
  }
}

// Generate statistic cards
const statCards = computed(() => [
  {
    title: t('ipni.stats.totalAdvertisements'),
    value: stats.value.totalAdvertisements,
    icon: IconBroadcast,
    color: 'primary',
    trend: {
      ...getTrendData(advertisementChange.value),
      text: advertisementChange.value > 0
        ? `${advertisementChange.value} ${t('ipni.stats.newToday')}`
        : t('ipni.stats.noChange'),
      color: advertisementChange.value > 0 ? 'success' : 'grey'
    }
  },
  {
    title: t('ipni.stats.providers'),
    value: stats.value.providers,
    icon: IconServerSpark,
    color: 'success',
    trend: {
      ...getTrendData(providerChange.value),
      text: providerChange.value !== 0
        ? `${providerChange.value > 0 ? '+' : ''}${providerChange.value} ${t('ipni.stats.today')}`
        : t('ipni.stats.noChange'),
      color: providerChange.value > 0 ? 'success' :
        providerChange.value < 0 ? 'error' : 'grey'
    }
  },
  {
    title: t('ipni.stats.indexedStatus'),
    value: `${stats.value.indexed} / ${stats.value.skipped}`,
    icon: IconDatabaseSearch,
    color: 'warning',
    trend: {
      ...getTrendData(indexedChange.value),
      text: `${indexedPercentage.value}% ${t('ipni.stats.indexed')}`,
      color: indexedPercentageChange.value > 0 ? 'success' :
        indexedPercentageChange.value < 0 ? 'error' : 'grey'
    }
  },
  {
    title: t('ipni.stats.pendingTasks'),
    value: stats.value.pendingTasks,
    icon: IconProgress,
    color: 'error',
    trend: {
      ...getTrendData(pendingTasksChange.value, true),
      text: pendingTasksChange.value !== 0
        ? t('ipni.stats.fewerThanYesterday')
        : t('ipni.stats.sameAsYesterday'),
      color: pendingTasksChange.value <= 0 ? 'success' : 'error'
    }
  }
])
</script>

<template>
  <v-row>
    <v-col
      v-for="(card, index) in statCards"
      :key="index"
      cols="12"
      sm="6"
      md="3"
    >
      <v-card
        height="100%"
        elevation="2"
        class="rounded-lg"
      >
        <v-card-text class="d-flex flex-column h-100">
          <div class="d-flex justify-space-between">
            <div class="text-subtitle-2 text-medium-emphasis">
              {{ card.title }}
            </div>
            <v-avatar
              :color="card.color"
              size="42"
              rounded
            >
              <v-icon
                color="white"
                :icon="card.icon"
              />
            </v-avatar>
          </div>
          <div class="mt-3">
            <div class="text-h4 font-weight-bold">
              <v-skeleton-loader
                v-if="loading"
                type="text"
                width="60"
              />
              <template v-else>
                {{ card.value }}
              </template>
            </div>
            <div class="d-flex align-center mt-2 text-caption">
              <v-icon
                :color="card.trend.color"
                size="small"
                class="mr-1"
                :icon="card.trend.icon"
              />
              <span :class="`text-${card.trend.color}`">{{ card.trend.text }}</span>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped>
.v-card {
  transition: transform 0.2s, box-shadow 0.2s;
}
.v-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1) !important;
}
</style>
