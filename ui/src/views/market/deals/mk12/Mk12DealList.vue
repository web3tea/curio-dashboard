<script setup lang="ts">
import { MarketMk12Deal } from '@/typed-graph'
import { GetMarketMk12Deals } from '@/gql/market'
import { useQuery } from '@vue/apollo-composable'
import { ComputedRef, computed, ref, onActivated, onDeactivated } from 'vue'
import { IconRefresh } from '@tabler/icons-vue'
import { formatBytes } from '@/utils/helpers/formatBytes'
import { refDebounced } from '@vueuse/core'
import { getRelativeTime } from '@/utils/helpers/time'

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
const searchDebounced = refDebounced(search, 500)

const searchFilter = computed(() => {
  const trimmed = searchDebounced.value?.trim()
  return trimmed === '' ? undefined : trimmed
})
const enabled = ref(true)

const { result, loading, refetch } = useQuery(GetMarketMk12Deals, () => ({
  filter: {
    uuid: searchFilter.value,
  },
  offset: offset.value,
  limit: limit.value,
}), () => ({
  fetchPolicy: 'cache-first',
  enabled: enabled.value,
  pollInterval: 10000,
}))

onActivated(() => {
  enabled.value = true
})

onDeactivated(() => {
  enabled.value = false
})
const items: ComputedRef<[MarketMk12Deal]> = computed(() => result.value?.marketMk12Deals || [])
const itemsCount: ComputedRef<number> = computed(() => {
  return result.value?.marketMk12DealsCount || itemsCount.value || 0
})
</script>
<template>
  <UiTableCard v-model="search">
    <template #actions>
      <v-btn
        :icon="IconRefresh"
        rounded
        variant="text"
        @click="refetch"
      />
    </template>
    <v-data-table-server
      v-model:items-per-page="limit"
      v-model:page="page"
      fixed-header
      :headers="headers"
      hover
      :items="items"
      :loading="loading"
      :items-length="itemsCount"
      height="calc(100vh - 330px)"
    >
      <template #item.uuid="{ value }">
        <RouterLink :to="{ name: 'MarketDealInfo', params: { id: value } }">
          <TruncatedText
            :text="value"
            :allow-copy="false"
          />
        </RouterLink>
        <CopyIcon
          :value="value"
          class="ms-1"
        />
      </template>
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
        <TruncatedText :text="value" />
      </template>
      <template #item.createdAt="{ value }">
        {{ getRelativeTime(value, 'long') }}
      </template>
      <template #item.pieceSize="{ value }">
        {{ formatBytes(value).combined }}
      </template>
    </v-data-table-server>
  </UiTableCard>
</template>
