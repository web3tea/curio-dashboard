<script setup lang="ts">
import { MarketMk12Deal } from '@/typed-graph'
import { GetMarketMk12Deals } from '@/gql/market'
import { useQuery } from '@vue/apollo-composable'
import { ComputedRef, computed } from 'vue'
import { IconReload } from '@tabler/icons-vue'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
import { formatBytes } from '@/utils/helpers/formatBytes'
import { useTableSettingsStore } from "@/stores/table"

const { d } = useI18n()
const tableSettings = useTableSettingsStore()

const headers = [
  { title: "UUID", key: "uuid" },
  { title: "Miner", key: "spId" },
  { title: "Created At", key: "createdAt" },
  { title: "Start Epoch", key: "startEpoch" },
  { title: "End Epoch", key: "endEpoch" },
  { title: "Piece CID", key: "pieceCid" },
  { title: "Piece Size", key: "pieceSize" },
]

const limit = ref(100)
const page = ref(1)
const offset = computed(() => (page.value - 1) * limit.value)

const { result, loading, refetch } = useQuery(GetMarketMk12Deals, {
  filter: {},
  offset: offset.value,
  limit: limit.value,
}, () => ({
  fetchPolicy: 'cache-first',
}))
const items: ComputedRef<[MarketMk12Deal]> = computed(() => result.value?.marketMk12Deals || [])
const itemsCount: ComputedRef<number> = computed(() => {
  return result.value?.marketMk12DealsCount || itemsCount.value || 0
})
</script>
<template>
  <UiTableCard>
    <template #actions>
      <v-btn
        :icon="IconReload"
        rounded
        variant="text"
        @click="refetch"
      />
    </template>
    <v-data-table-server
      v-model:items-per-page="tableSettings.itemsPerPage"
      :page="page"
      fixed-header
      :headers="headers"
      hover
      :items="items"
      :loading="loading"
      :items-length="itemsCount"
    >
      <template #item.spId="{ value }">
        <RouterLink :to="{ name: 'MinerDetails', params: { id: value } }">
          {{ value }}
        </RouterLink>
      </template>
      <template #item.startEpoch="{ value }">
        <EpochField :epoch="value" />
      </template>
      <template #item.endEpoch="{ value }">
        <EpochField :epoch="value" />
      </template>
      <template #item.pieceCid="{ value }">
        <TruncatedChip :text="value" />
      </template>
      <template #item.createdAt="{ value }">
        {{ d(value, 'long') }}
      </template>
      <template #item.pieceSize="{ value }">
        {{ formatBytes(value).combined }}
      </template>
    </v-data-table-server>
  </UiTableCard>
</template>
