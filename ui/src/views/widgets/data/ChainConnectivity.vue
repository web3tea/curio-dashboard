<script setup lang="ts">

import { useQuery } from '@vue/apollo-composable'
import { GetNodeInfos } from '@/views/query/chain'
import { computed, ComputedRef } from 'vue'
import { NodeInfo } from '@/typed-graph'
import UiTitleCard from '@/components/shared/UiTitleCard.vue'
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
  <UiTitleCard class-name="px-0 pb-0 rounded-md" :title="$t('fields.Chain Connectivity')">
    <template #action>
      <v-btn
        :disabled="loading"
        :icon="IconReload"
        round
        :rounded="true"
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
  </UiTitleCard>
</template>

<style scoped lang="scss">
</style>
