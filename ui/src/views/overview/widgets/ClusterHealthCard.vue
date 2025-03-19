<script setup lang="ts">
import {  ComputedRef, computed } from 'vue'
import gql from 'graphql-tag'
import { useQuery } from '@vue/apollo-composable'
import { NodeHealthSummary } from '@/typed-graph'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

withDefaults(defineProps<{
  title?: string;
  tooltip?: string;
  detailsLink?: string;
  detailsText?: string;
  timeRange?: string;
}>(), {
  title: 'Cluster Health',
  tooltip: 'Cluster health percentage calculated based on node online status',
  detailsLink: '#',
  detailsText: 'View Details',
  timeRange: '24h',
})

const { result, loading, refetch } = useQuery(gql`
  query NodeHealth {
    nodeHealthSummary {
      onlineNodes
      warningNodes
      unscheduledNodes
      offlineNodes
      trend
      trendValue
    }
  }
  `, null, {})
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
    :title="t('clusterHealth.title', title)"
    :tooltip="t('clusterHealth.tooltip', tooltip)"
    :details-link="detailsLink"
    :details-text="t('common.viewDetails', detailsText)"
    :trend="item.trend"
    :trend-value="item.trendValue"
    @click="handleClick"
  >
    <div
      v-if="!loading"
      class="text-center"
    >
      <div class="text-h2 font-weight-bold">
        {{ item.onlineNodes / (item.onlineNodes + item.warningNodes + item.unscheduledNodes + item.offlineNodes) * 100 }}%
      </div>

      <v-row class="mt-4">
        <v-col
          cols="3"
          class="text-center"
        >
          <v-badge
            :content="item.onlineNodes.toString()"
            color="success"
            inline
          />
          <div class="text-caption text-grey">
            {{ t('clusterHealth.onlineNodes', 'Online') }}
          </div>
        </v-col>
        <v-col
          cols="3"
          class="text-center"
        >
          <v-badge
            :content="item.unscheduledNodes.toString()"
            inline
          />
          <div class="text-caption text-grey">
            {{ t('clusterHealth.unscheduledNodes', 'Cordoned') }}
          </div>
        </v-col>
        <v-col
          cols="3"
          class="text-center"
        >
          <v-badge
            :content="item.warningNodes.toString()"
            color="warning"
            inline
          />
          <div class="text-caption text-grey">
            {{ t('clusterHealth.warningNodes', "Warning") }}
          </div>
        </v-col>

        <v-col
          cols="3"
          class="text-center"
        >
          <v-badge
            :content="item.offlineNodes.toString()"
            color="error"
            inline
          />
          <div class="text-caption text-grey">
            {{ t('clusterHealth.offlineNodes', 'Offline') }}
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
        {{ t('common.loading', 'Loading') }}
      </div>
    </div>
  </dashboardcard>
</template>
