<script setup lang="ts">

import UiChildCard from '@/components/shared/UiChildCard.vue'
import { useQuery } from '@vue/apollo-composable'
import { GetSectorLocations } from '@/views/query/sector'
import { computed, ComputedRef } from 'vue'
import { SectorLocation } from '@/typed-graph'
import type { Header } from 'vue3-easy-data-table'
import { sectorFileTypeToName } from '@/utils/helpers/sectorFileType'

const props = defineProps({
  miner: {
    type: String,
    required: true,
  },
  sectorNumber: {
    type: String,
    required: true,
  },
})

const { result, loading, refetch, error } = useQuery(GetSectorLocations, {
  miner: props.miner,
  sectorNumber: props.sectorNumber,
}, () => ({
  fetchPolicy: 'cache-first',
}))

const locations: ComputedRef<[SectorLocation]> = computed(() => result.value?.sector.locations || [])

const headers :Header[] = [
  { text: 'File type', value: 'sectorFiletype' },
  { text: 'Storage Id', value: 'storageId' },
  { text: 'Is Primary', value: 'isPrimary' },
  { text: 'ReadTs', value: 'readTs' },
  { text: 'ReadRefs', value: 'readRefs' },
  { text: 'WriteTs', value: 'writeTs' },
  { text: 'WriteLockOwner', value: 'writeLockOwner' },
]
</script>

<template>
  <UiChildCard :loading="loading" title="Sector Locations ">
    <template #action>
      <v-btn round :rounded="true" variant="text" @click="refetch">
        <ReloadIcon />
      </v-btn>
    </template>
    <EasyDataTable
      :headers="headers"
      hide-footer
      :items="locations"
      :loading="loading"
      :rows-per-page="100"
      table-class-name="customize-table"
      theme-color="primary"
    >
      <template #empty-message>
        <p class="text-high-emphasis">{{ error?.message || 'No Data' }} </p>
      </template>
      <template #item-sectorFiletype="{ sectorFiletype }">
        <v-chip>{{ sectorFileTypeToName(sectorFiletype) }}</v-chip>
      </template>
    </EasyDataTable>
  </UiChildCard>
</template>

<style scoped lang="scss">

</style>
