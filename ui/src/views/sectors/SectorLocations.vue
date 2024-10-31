<script setup lang="ts">

import UiChildCard from '@/components/shared/UiChildCard.vue'
import { useQuery } from '@vue/apollo-composable'
import { GetSectorLocations } from '@/views/query/sector'
import { computed, ComputedRef } from 'vue'
import { SectorLocation } from '@/typed-graph'
import { sectorFileTypeToName } from '@/utils/helpers/sectorFileType'
import { IconReload } from '@tabler/icons-vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

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

const { result, loading, refetch } = useQuery(GetSectorLocations, {
  miner: props.miner,
  sectorNumber: props.sectorNumber,
}, () => ({
  fetchPolicy: 'cache-first',
}))

const locations: ComputedRef<[SectorLocation]> = computed(() => result.value?.sector.locations || [])

const headers = [
  { title: 'File type', key: 'sectorFiletype' },
  { title: 'Storage Id', key: 'storageId' },
  { title: 'Is Primary', key: 'isPrimary' },
  { title: 'ReadTs', key: 'readTs' },
  { title: 'ReadRefs', key: 'readRefs' },
  { title: 'WriteTs', key: 'writeTs' },
  { title: 'WriteLockOwner', key: 'writeLockOwner' },
]
</script>

<template>
  <UiChildCard :title="t('fields.Sector Locations')">
    <template #action>
      <v-btn
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
      hover
      :items="locations"
      :loading="loading"
    >
      <template #item.sectorFiletype="{ item }">
        <v-chip>{{ sectorFileTypeToName(item.sectorFiletype) }}</v-chip>
      </template>
    </v-data-table-virtual>
  </UiChildCard>
</template>

<style scoped lang="scss">

</style>
