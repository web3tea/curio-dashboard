<script setup lang="ts">

import { useQuery } from '@vue/apollo-composable'
import { GetNodeInfos } from '@/gql/chain'
import { computed, ComputedRef } from 'vue'
import { NodeInfo } from '@/typed-graph'
import { IconReload } from '@tabler/icons-vue'

const headers = [
  { title: 'Address', key: 'address', sortable: false },
  { title: 'Reachability', key: 'reachable' },
  { title: 'Sync Status', key: 'syncState' },
  { title: 'Version', key: 'version' },
]

const { result, loading, refetch } = useQuery(GetNodeInfos, null, () => ({
  fetchPolicy: 'cache-first',
}))

const items: ComputedRef<[NodeInfo]> = computed(() => result.value?.nodesInfo || [])

</script>

<template>
  <UiWidgetCard
    class-name="px-0 pb-0 rounded-md"
    :title="$t('fields.Chain Connectivity')"
  >
    <template #append>
      <v-btn
        :disabled="loading"
        :icon="IconReload"
        rounded
        variant="text"
        @click="refetch"
      />
    </template>
    <v-data-table-virtual
      fixed-header
      :headers="headers"
      height="300"
      hover
      :items="items"
      :loading="loading"
    />
  </UiWidgetCard>
</template>

<style scoped lang="scss">
</style>
