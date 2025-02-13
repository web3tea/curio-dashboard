<script setup lang="ts">
import { MarketMk12Deal } from '@/typed-graph'
import { GetMarketMk12Deals } from '@/gql/market'
import { useQuery } from '@vue/apollo-composable'
import { ComputedRef, computed, ref } from 'vue'
import { IconReload } from '@tabler/icons-vue'
import { useI18n } from 'vue-i18n'
import { formatBytes } from '@/utils/helpers/formatBytes'
import { watchDebounced } from '@vueuse/core'

const { d } = useI18n()

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

const search = ref<string>()
const searchDebounced = ref<string>()

watchDebounced(search, (value) => {
  searchDebounced.value = value?.trim() === '' ? undefined : value
}, { debounce: 1000 })

const { result, loading, refetch } = useQuery(GetMarketMk12Deals, {
  filter: {
    uuid: searchDebounced,
  },
  offset: offset,
  limit: limit,
}, () => ({
  fetchPolicy: 'cache-first',
}))
const items: ComputedRef<[MarketMk12Deal]> = computed(() => result.value?.marketMk12Deals || [])
const itemsCount: ComputedRef<number> = computed(() => {
  return result.value?.marketMk12DealsCount || itemsCount.value || 0
})
</script>
<template>
  <UiTableCard v-model="search">
    <template #actions>
      <v-btn
        :icon="IconReload"
        rounded
        variant="text"
        @click="refetch"
      />
    </template>
    <v-data-table-server
      :items-per-page="limit"
      :page="page"
      fixed-header
      :headers="headers"
      hover
      :items="items"
      :loading="loading"
      :items-length="itemsCount"
      height="calc(100vh - 330px)"
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
