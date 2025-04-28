<script setup lang="ts">
import { computed, ComputedRef, ref } from 'vue'
import { useQuery,useMutation } from '@vue/apollo-composable'
import { GetMarketClientFilters,DeleteMarketClientFilter, ToggleMarketClientFilter } from '@/gql/market'
import { ClientFilter } from '@/typed-graph'
import { IconRefresh } from '@tabler/icons-vue'
import SetClientFilter from './widgets/SetClientFilter.vue'
import { formatBytes } from '@/utils/helpers/formatBytes'

const headers = [
  { title: 'Name', key: 'name' },
  { title: 'Active', key: 'active' },
  { title: 'Wallets', key: 'wallets' },
  { title: 'Peers', key: 'peers' },
  { title: 'Pricing Filters', key: 'pricingFilters' },
  { title: 'Max Deals Per Hour', key: 'maxDealsPerHour' },
  { title: 'Max Deal Size Per Hour', key: 'maxDealSizePerHour' },
  { title: 'Info', key: 'info' },
  { title: '    ', key: 'actions' },
]

const { result, loading, refetch } = useQuery(GetMarketClientFilters, null, {})
const items: ComputedRef<[ClientFilter]> = computed(() => result.value?.marketClientFilters || [])

const searchValue = ref<string>()
const deletingItem = ref<string | null>(null)

const { mutate } = useMutation(DeleteMarketClientFilter, {
  refetchQueries: [{
    query: GetMarketClientFilters,
  }],
})

const handleDelete = async (name: string) => {
  deletingItem.value = name
  try {
    await mutate({ name })
  } finally {
    deletingItem.value = null
  }
}

const toggleItem = ref<string | null>(null)
const { mutate: toggle } = useMutation(ToggleMarketClientFilter, {
  refetchQueries: [{
    query: GetMarketClientFilters,
  }],
  awaitRefetchQueries: true,
})

const handleToggle = async (name: string) => {
  toggleItem.value = name
  try {
    await toggle({ name })
  } finally {
    toggleItem.value = null
  }
}

</script>
<template>
  <UiTableCard
    v-model="searchValue"
  >
    <template #actions>
      <SetClientFilter action="add" />
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
      <template #item.maxDealSizePerHour="{ value }">
        {{ formatBytes(value).combined }}
      </template>
      <template #item.active="{ item }">
        <v-switch
          color="primary"
          :model-value="item.active"
          :loading="toggleItem === item.name"
          @update:model-value="handleToggle(item.name)"
        />
      </template>
      <template #item.actions="{ item }">
        <SetClientFilter
          action="update"
          :item="item"
        />
        <v-btn
          class="ml-2"
          color="error"
          variant="elevated"
          :loading="deletingItem === item.name"
          @click="handleDelete(item.name)"
        >
          Remove
        </v-btn>
      </template>
    </v-data-table-virtual>
  </UiTableCard>
</template>
