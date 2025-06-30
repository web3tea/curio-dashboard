<script setup lang="ts">
import { useQuery } from '@vue/apollo-composable'
import { computed, ComputedRef, ref, onActivated, onDeactivated } from 'vue'
import { GetMarketBalances } from '@/gql/market'
import { MarketBalance } from '@/typed-graph'
import { IconRefresh } from '@tabler/icons-vue'
import AddBalance from './widgets/AddBalance.vue'

const headers = [
  { title: 'Miner', key: 'miner' },
  { title: 'Balance', key: 'balance' },
  { title: 'Control Balances', key: 'controlBalances' },
  { title: '  ', key: 'actions' },
]
const enabled = ref(true)

const { result, loading, refetch } = useQuery(GetMarketBalances, null, () => ({
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
const items: ComputedRef<[MarketBalance]> = computed(() => result.value?.marketBalances || [])

const searchValue = ref<string>()

</script>
<template>
  <UiTableCard
    v-model="searchValue"
  >
    <template #actions>
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
      <template #item.miner="{ value }">
        <RouterLink :to="{ name: 'MinerDetails', params: { id: value } }">
          {{ value }}
        </RouterLink>
      </template>
      <template #item.actions="{ item }">
        <AddBalance :miner="item.miner" />
      </template>
    </v-data-table-virtual>
  </UiTableCard>
</template>
