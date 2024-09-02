<script setup lang="ts">

import { useQuery } from '@vue/apollo-composable'
import { computed, ComputedRef, ref } from 'vue'
import { StorageStats } from '@/typed-graph'
import UiTitleCard from '@/components/shared/UiTitleCard.vue'
import { GetStorageStats } from '@/views/query/storage'
import { formatBytes } from '@/utils/helpers/formatBytes'

const headers = [
  { text: 'Type', value: 'type' },
  { text: 'Capacity', value: 'totalCapacity' },
  { text: 'Available', value: 'totalAvailable' },
  { text: 'Reserved', value: 'totalReserved' },
  { text: '', value: 'progress', width: 300 },
]

const themeColor = ref('rgb(var(--v-theme-primary))')

const { result, loading, error } = useQuery(GetStorageStats, null, () => ({
  fetchPolicy: 'cache-first',
}))

const items: ComputedRef<[StorageStats]> = computed(() => result.value?.storageStats || [])

function usePercentage (available: number, total: number) {
  return ((1 - (available / total)) * 100)
}

</script>

<template>
  <UiTitleCard class-name="px-0 pb-0 rounded-md" title="Storage Usages">
    <EasyDataTable
      :headers="headers"
      hide-footer
      :items="items"
      :loading="loading"
      :rows-per-page="100"
      table-class-name="customize-table"
      :theme-color="themeColor"
    >
      <template #empty-message>
        <p class="text-high-emphasis">{{ error?.message || 'No Data' }} </p>
      </template>
      <template #item-totalCapacity="{totalCapacity}">
        {{ formatBytes(totalCapacity).combined }}
      </template>
      <template #item-totalAvailable="{totalAvailable}">
        {{ formatBytes(totalAvailable).combined }}
      </template>
      <template #item-totalReserved="{totalReserved}">
        {{ formatBytes(totalReserved).combined }}
      </template>
      <template #item-progress="{totalCapacity, totalAvailable}">
        <div class="d-flex align-center">
          <v-progress-linear
            aria-label="progressbar"
            :color="usePercentage(totalAvailable, totalCapacity) > 90 ? 'error' : 'success'"
            height="20"
            :model-value="usePercentage(totalAvailable, totalCapacity)"
            rounded
          />
          <span class="text-caption text-lightText ml-8 d-block">{{ usePercentage(totalAvailable, totalCapacity).toFixed(2) }}%</span>
        </div>
      </template>
    </EasyDataTable>
  </UiTitleCard>
</template>

<style scoped lang="scss">
</style>
