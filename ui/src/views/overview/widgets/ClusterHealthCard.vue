<script setup lang="ts">
import {  ComputedRef, computed } from 'vue'
import gql from 'graphql-tag'
import { useQuery } from '@vue/apollo-composable'
import { NodeHealthSummary } from '@/typed-graph'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

withDefaults(defineProps<{
  detailsLink?: string;
  timeRange?: string;
}>(), {
  detailsLink: '#',
  timeRange: '24h',
})

const { result, loading, refetch } = useQuery(gql`
  query NodeHealth {
    nodeHealthSummary {
      onlineNodes
      unscheduledNodes
      offlineNodes
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
    :title="t('clusterHealth.title')"
    :tooltip="t('clusterHealth.tooltip')"
    :details-link="detailsLink"
    :details-text="t('common.viewDetails')"
    trend="NORMAL"
    :trend-value="t('common.stable')"
    @click="handleClick"
  >
    <div
      v-if="!loading"
      class="text-center"
    >
      <div class="text-h2 font-weight-bold">
        {{ item.onlineNodes / (item.onlineNodes + item.unscheduledNodes + item.offlineNodes) * 100 }}%
      </div>

      <v-row class="mt-4">
        <v-col
          cols="4"
          class="text-center"
        >
          <v-badge
            :content="item.onlineNodes.toString()"
            color="success"
            inline
          />
          <div class="text-caption text-grey">
            {{ t('clusterHealth.online') }}
          </div>
        </v-col>
        <v-col
          cols="4"
          class="text-center"
        >
          <v-badge
            :content="item.unscheduledNodes.toString()"
            inline
          />
          <div class="text-caption text-grey">
            {{ t('clusterHealth.unscheduled') }}
          </div>
        </v-col>
        <v-col
          cols="4"
          class="text-center"
        >
          <v-badge
            :content="item.offlineNodes.toString()"
            color="error"
            inline
          />
          <div class="text-caption text-grey">
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
