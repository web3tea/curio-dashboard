<script setup lang="ts">

import { useQuery } from '@vue/apollo-composable'
import { GetNodeInfos } from '@/views/query/chain'
import { computed, ComputedRef, ref } from 'vue'
import { NodeInfo } from '@/typed-graph'
import UiTitleCard from '@/components/shared/UiTitleCard.vue'
import { IconReload } from '@tabler/icons-vue'

const headers = [
  { text: 'Address', value: 'address' },
  { text: 'Reachability', value: 'reachable' },
  { text: 'Sync Status', value: 'syncState' },
  { text: 'Version', value: 'version' },
]

const themeColor = ref('rgb(var(--v-theme-primary))')

const { result, loading, refetch, error } = useQuery(GetNodeInfos, null, () => ({
  fetchPolicy: 'cache-first',
}))

const items: ComputedRef<[NodeInfo]> = computed(() => result.value?.nodesInfo || [])

</script>

<template>
  <UiTitleCard class-name="px-0 pb-0 rounded-md" title="Chain Connectivity">
    <template #action>
      <v-btn
        :disabled="loading"
        round
        :rounded="true"
        variant="text"
        @click="refetch"
      >
        <IconReload />
      </v-btn>
    </template>
    <EasyDataTable
      :headers="headers"
      hide-footer
      :items="items"
      :loading="loading"
      :rows-per-page="100"
      table-class-name="customize-table"
      :theme-color="themeColor"
    >
      <template #empty-message>
        {{ error?.message || 'No Data' }}
      </template>
      <template #item-reachable="{ reachable }">
        <v-chip class="px-0" size="small" variant="text">
          <v-avatar class="mr-2" :color=" reachable ? 'success' : 'error'" size="8" variant="flat" />
          <p class="text-h6 mb-0">{{ reachable ? 'ok' : 'no' }}</p>
        </v-chip>
      </template>
      <template #item-syncState="{ syncState }">
        <v-chip class="px-0" size="small" variant="text">
          <v-avatar class="mr-2" :color=" syncState === 'ok' ? 'success' : 'error'" size="8" variant="flat" />
          <p class="text-h6 mb-0">{{ syncState }}</p>
        </v-chip>
      </template>
    </EasyDataTable>
  </UiTitleCard>
</template>

<style scoped lang="scss">
</style>
