<script setup lang="ts">

import { useQuery } from '@vue/apollo-composable'
import { computed, ComputedRef } from 'vue'
import { StorageStats } from '@/typed-graph'
import UiTitleCard from '@/components/shared/UiTitleCard.vue'
import { GetStorageStats } from '@/gql/storage'
import { formatBytes } from '@/utils/helpers/formatBytes'
import { IconReload } from '@tabler/icons-vue'

const headers = [
  { title: 'Type', key: 'type' },
  { title: 'Capacity', key: 'totalCapacity' },
  { title: 'Available', key: 'totalAvailable' },
  { title: 'Reserved', key: 'totalReserved' },
  { title: '', key: 'progress', width: 300 },
]

const { result, loading, refetch } = useQuery(GetStorageStats, null, () => ({
  fetchPolicy: 'cache-first',
}))

const items: ComputedRef<[StorageStats]> = computed(() => result.value?.storageStats || [])

function usePercentage (available: number, total: number) {
  return ((1 - (available / total)) * 100)
}

</script>

<template>
  <UiTitleCard class-name="px-0 pb-0 rounded-md" :title="$t('fields.Storage Usages')">
    <template #action>
      <v-btn
        :disabled="loading"
        :icon="IconReload"
        round
        :rounded="true"
        variant="text"
        @click="refetch"
      />
    </template>
    <v-data-table-virtual
      fixed-header
      :headers="headers"
      :height="300"
      hover
      :items="items"
      :loading="loading"
    >
      <template #item.totalCapacity="{item}">
        {{ formatBytes(item.totalCapacity).combined }}
      </template>
      <template #item.totalAvailable="{item}">
        {{ formatBytes(item.totalAvailable).combined }}
      </template>
      <template #item.totalReserved="{item}">
        {{ formatBytes(item.totalReserved).combined }}
      </template>
      <template #item.progress="{item}">
        <div class="d-flex align-center">
          <v-progress-linear
            aria-label="progressbar"
            :color="usePercentage(item.totalAvailable, item.totalCapacity) > 90 ? 'error' : 'success'"
            height="20"
            :model-value="usePercentage(item.totalAvailable, item.totalCapacity)"
            rounded
          />
          <span class="text-caption text-lightText ml-8 d-block">{{ usePercentage(item.totalAvailable, item.totalCapacity).toFixed(2) }}%</span>
        </div>
      </template>
    </v-data-table-virtual>
  </UiTitleCard>
</template>

<style scoped lang="scss">
</style>
