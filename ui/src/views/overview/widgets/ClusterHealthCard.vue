<script setup lang="ts">
import {  ComputedRef, computed } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { NodeHealthSummary } from '@/typed-graph'
import { useI18n } from 'vue-i18n'
import { RouteLocationRaw } from 'vue-router'
import { GetNodeHealth } from '@/gql/machine'

const { t } = useI18n()

defineProps({
  detailsLink: {
    type: Object as () => RouteLocationRaw,
    default: () => ({ name: 'Machines' })
  }
})

const { result, loading, refetch } = useQuery(GetNodeHealth, null, {
  pollInterval: 10000
})
const item: ComputedRef<NodeHealthSummary> = computed(() => result.value?.nodeHealthSummary || {})

const emit = defineEmits<(e: 'click', event?: MouseEvent) => void>()

const handleClick = (event?: MouseEvent): void => {
  emit('click', event)
}

defineExpose({
  refetch
})

</script>

<template>
  <DashboardCard
    :title="t('clusterHealth.title')"
    :tooltip="t('clusterHealth.tooltip')"
    :details-link="detailsLink"
    :details-text="t('common.viewDetails')"
    trend="GOOD"
    @click="handleClick"
  >
    <div
      v-if="!loading"
      class="text-center"
    >
      <div class="text-h2 font-weight-bold">
        {{ item.onlineNodes / (item.onlineNodes + item.unscheduledNodes + item.offlineNodes) * 100 }}%
      </div>

      <v-row class="mt-2 w-100">
        <v-col
          cols="4"
          class="text-center"
        >
          <v-chip
            size="small"
            color="success"
            class="font-weight-medium"
          >
            {{ item.onlineNodes }}
          </v-chip>
          <div class="text-caption text-medium-emphasis mt-1">
            {{ t('clusterHealth.online') }}
          </div>
        </v-col>

        <v-col
          cols="4"
          class="text-center"
        >
          <v-chip
            size="small"
            color="warning"
            class="font-weight-medium"
          >
            {{ item.unscheduledNodes }}
          </v-chip>
          <div class="text-caption text-medium-emphasis mt-1">
            {{ t('clusterHealth.unscheduled') }}
          </div>
        </v-col>

        <v-col
          cols="4"
          class="text-center"
        >
          <v-chip
            size="small"
            color="error"
            class="font-weight-medium"
          >
            {{ item.offlineNodes }}
          </v-chip>
          <div class="text-caption text-medium-emphasis mt-1">
            {{ t('clusterHealth.offline') }}
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
