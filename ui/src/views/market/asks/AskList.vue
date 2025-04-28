<script setup lang="ts">

import { useQuery } from '@vue/apollo-composable'
import { computed, ComputedRef,ref } from 'vue'
import { GetMarketMk12StorageAsks } from '@/gql/market'
import { MarketMk12StorageAsk } from '@/typed-graph'
import { attoFilToFilPerTiBPerMonth } from '@/utils/helpers/convertPrice'
import { formatBytes } from '@/utils/helpers/formatBytes'
import { IconRefresh } from '@tabler/icons-vue'
import { getRelativeTime } from '@/utils/helpers/time'
import SetAsk from './widgets/SetAsk.vue'

const { result, loading, refetch } = useQuery(GetMarketMk12StorageAsks, null, () => ({
  fetchPolicy: 'cache-first',
}))
const items: ComputedRef<[MarketMk12StorageAsk]> = computed(() => result.value?.marketMk12StorageAsks || [])

const headers = [
  { title: 'Miner', key: 'spId' },
  { title: 'Price (FIL)', key: 'priceFTM' },
  { title: 'Price (attoFIL)', key: 'price' },
  { title: 'Verified Price (FIL)', key: 'verifiedPriceFTM' },
  { title: 'Verified Price (attoFIL)', key: 'verifiedPrice' },
  { title: 'Min Size', key: 'minSize' },
  { title: 'Max Size', key: 'maxSize' },
  { title: 'Created At', key: 'createdAt' },
  { title: 'Expiry', key: 'expiry' },
  { title: 'Sequence', key: 'sequence' },
  { title: '  ', key: 'actions' },
]

const searchValue = ref<string>()

</script>
<template>
  <UiTableCard
    v-model="searchValue"
  >
    <template #actions>
      <SetAsk
        miner=""
        action="add"
      />
      <v-btn
        :icon="IconRefresh"
        rounded
        variant="text"
        @click="refetch"
      />
    </template>
    <v-data-table-virtual
      fixed-header
      :headers="headers"
      hover
      :items="items"
      :loading="loading"
      :search="searchValue"
    >
      <template #header.priceFTM="{ column }">
        <v-tooltip
          location="top"
          max-width="300"
        >
          <template #activator="{ props }">
            <span v-bind="props">{{ column.title }}</span>
          </template>
          <span>Price in FIL per TiB per Month</span>
        </v-tooltip>
      </template>
      <template #header.price="{ column }">
        <v-tooltip
          location="top"
          max-width="300"
        >
          <template #activator="{ props }">
            <span v-bind="props">{{ column.title }}</span>
          </template>
          <span>Price in attoFIL per GiB per Epoch</span>
        </v-tooltip>
      </template>
      <template #header.verifiedPriceFTM="{ column }">
        <v-tooltip
          location="top"
          max-width="300"
        >
          <template #activator="{ props }">
            <span v-bind="props">{{ column.title }}</span>
          </template>
          <span>Verified Price in FIL per TiB per Month</span>
        </v-tooltip>
      </template>
      <template #header.verifiedPrice="{ column }">
        <v-tooltip
          location="top"
          max-width="300"
        >
          <template #activator="{ props }">
            <span v-bind="props">{{ column.title }}</span>
          </template>
          <span>Verified Price in attoFIL per GiB per Epoch</span>
        </v-tooltip>
      </template>
      <template #item.spId="{ value }">
        <RouterLink :to="{ name: 'MinerDetails', params: { id: value } }">
          {{ value }}
        </RouterLink>
      </template>
      <template #item.priceFTM="{ item }">
        {{ attoFilToFilPerTiBPerMonth(item.price) }}
      </template>
      <template #item.verifiedPriceFTM="{ item }">
        {{ attoFilToFilPerTiBPerMonth(item.verifiedPrice) }}
      </template>
      <template #item.minSize="{ value }">
        {{ formatBytes(value).combined }}
      </template>
      <template #item.maxSize="{ value }">
        {{ formatBytes(value).combined }}
      </template>
      <template #item.createdAt="{ value }">
        {{ getRelativeTime(value * 1000, 'long') }}
      </template>
      <template #item.expiry="{ value }">
        {{ getRelativeTime(value * 1000, 'long') }}
      </template>
      <template #item.actions="{ item }">
        <SetAsk
          :miner="item.spId"
          action="update"
        />
      </template>
    </v-data-table-virtual>
  </UiTableCard>
</template>
