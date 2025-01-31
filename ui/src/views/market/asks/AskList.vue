<script setup lang="ts">

import { useQuery } from '@vue/apollo-composable'
import { computed, ComputedRef,ref } from 'vue'
import { GetMarketMk12StorageAsks } from '@/gql/market'
import { MarketMk12StorageAsk } from '@/typed-graph'
import { attoFilToFilPerTiBPerMonth } from '@/utils/helpers/convertPrice'
import { formatBytes } from '@/utils/helpers/formatBytes'
import { IconReload } from '@tabler/icons-vue'
import { useI18n } from 'vue-i18n'
import SetAsk from './widgets/SetAsk.vue'

const { d } = useI18n()

const { result, loading, refetch } = useQuery(GetMarketMk12StorageAsks, null, () => ({
  fetchPolicy: 'cache-first',
}))
const items: ComputedRef<[MarketMk12StorageAsk]> = computed(() => result.value?.marketMk12StorageAsks || [])

const headers = [
  { title: 'Miner', key: 'spId' },
  { title: 'Price (FIL/TiB/Month)', key: 'priceFTM' },
  { title: 'Price (attoFIL/GiB/Epoch)', key: 'price' },
  { title: 'Verified Price (FIL/TiB/Month)', key: 'verifiedPriceFTM' },
  { title: 'Verified Price (attoFIL/GiB/Epoch)', key: 'verifiedPrice' },
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
        :icon="IconReload"
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
        {{ d(value * 1000, 'long') }}
      </template>
      <template #item.expiry="{ value }">
        {{ d(value * 1000, 'long') }}
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
