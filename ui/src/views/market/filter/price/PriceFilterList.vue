<script setup lang="ts">
import { useQuery } from '@vue/apollo-composable'
import { computed, ComputedRef,ref } from 'vue'
import { GetMarketPriceFilters } from '@/gql/market'
import { PriceFilter } from '@/typed-graph'
import { IconReload } from '@tabler/icons-vue'
import SetPriceFilter from './widgets/SetPriceFilter.vue'
import { formatBytes } from '@/utils/helpers/formatBytes'

const headers = [
  { title: 'Name', key: 'name' },
  { title: 'Min Duration (Days)', key: 'minDurationDays' },
  { title: 'Max Duration (Days)', key: 'maxDurationDays' },
  { title: 'Minimum Size', key: 'minimumSize' },
  { title: 'Maximum Size', key: 'maximumSize' },
  { title: 'Price', key: 'price' },
  { title: 'Verified', key: 'verified' },
]

const { result, loading, refetch } = useQuery(GetMarketPriceFilters, null, () => ({
}))
const items: ComputedRef<[PriceFilter]> = computed(() => result.value?.makretPriceFilters || [])

const searchValue = ref<string>()

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
      <template #item.actions="{ }" />
    </v-data-table-virtual>
  </UiTableCard>
</template>
