<script setup lang="ts">
import { useQuery } from '@vue/apollo-composable'
import { computed, ComputedRef, PropType } from 'vue'
import { PriceFilter } from '@/typed-graph'
import { GetMarketPriceFilters } from '@/gql/market'

const pricingFilters = defineModel({
  type: Array as PropType<string[]>,
  default: () => [],
})

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
})

const { result, loading } = useQuery(GetMarketPriceFilters, null, {})

const filters: ComputedRef<[PriceFilter]> = computed(() => result.value?.makretPriceFilters || [])

</script>

<template>
  <v-autocomplete
    v-model="pricingFilters"
    clearable
    color="primary"
    density="comfortable"
    :disabled="loading || props.disabled"
    item-title="name"
    :items="filters"
    variant="outlined"
    multiple
  />
</template>

<style scoped lang="scss">

</style>
