<script setup lang="ts">
import { useQuery, useMutation } from '@vue/apollo-composable'
import { computed, ComputedRef,ref } from 'vue'
import { DeleteMarketPriceFilter, GetMarketPriceFilters } from '@/gql/market'
import { PriceFilter } from '@/typed-graph'
import { IconReload } from '@tabler/icons-vue'
import SetPriceFilter from './widgets/SetPriceFilter.vue'
import { formatBytes } from '@/utils/helpers/formatBytes'
import { attoFilToFilPerTiBPerMonth } from '@/utils/helpers/convertPrice'

const headers = [
  { title: 'Name', key: 'name' },
  { title: 'Min Duration (Days)', key: 'minDurationDays' },
  { title: 'Max Duration (Days)', key: 'maxDurationDays' },
  { title: 'Minimum Size', key: 'minimumSize' },
  { title: 'Maximum Size', key: 'maximumSize' },
  { title: 'Price (attoFIL/GiB/Epoch)', key: 'price' },
  { title: 'Price (FIL/TiB/Month)', key: 'priceFTM' },
  { title: 'Verified', key: 'verified' },
  { title: '    ', key: 'actions' },
]

const { result, loading, refetch } = useQuery(GetMarketPriceFilters, null, () => ({
}))
const items: ComputedRef<[PriceFilter]> = computed(() => result.value?.makretPriceFilters || [])

const searchValue = ref<string>()
const deletingItem = ref<string | null>(null)

const { mutate } = useMutation(DeleteMarketPriceFilter, {
  refetchQueries: [{
    query: GetMarketPriceFilters,
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

</script>
<template>
  <UiTableCard
    v-model="searchValue"
  >
    <template #actions>
      <SetPriceFilter action="add" />
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
      <template #item.minimumSize="{ value }">
        {{ formatBytes(value).combined }}
      </template>
      <template #item.maximumSize="{ value }">
        {{ formatBytes(value).combined }}
      </template>
      <template #item.verified="{ value }">
        <v-checkbox
          :model-value="value"
          color="primary"
          disabled
        />
      </template>
      <template #item.priceFTM="{ item }">
        {{ attoFilToFilPerTiBPerMonth(item.price) }}
      </template>
      <template #item.actions="{ item }">
        <SetPriceFilter
          :key="item.name"
          :item="item"
          action="update"
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
