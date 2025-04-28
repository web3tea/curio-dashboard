<script setup lang="ts">
import { useQuery } from '@vue/apollo-composable'
import { GetNodeInfos } from '@/gql/chain'
import { computed, ComputedRef } from 'vue'
import { NodeInfo } from '@/typed-graph'
import { IconRefresh } from '@tabler/icons-vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const headers = [
  { title: 'Address', key: 'address', sortable: false },
  { title: 'Reachability', key: 'reachable', align: 'center' },
  { title: 'Sync Status', key: 'syncState', align: 'center' },
  { title: 'Version', key: 'version' },
] as const

const { result, loading, refetch } = useQuery(GetNodeInfos, null, () => ({
  fetchPolicy: 'cache-first',
}))

const items: ComputedRef<[NodeInfo]> = computed(() => result.value?.nodesInfo || [])

</script>

<template>
  <UiWidgetCard
    class-name="px-0 pb-0 rounded-md"
    :title="t('fields.Chain Connectivity')"
  >
    <template #append>
      <v-btn
        :disabled="loading"
        :icon="IconRefresh"
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
    >
      <template #item.reachable="{ value }">
        <StatusIcon
          :status="value ? 'success': 'failure'"
          :tooltip="value ? 'Yes': 'No'"
        />
      </template>
      <template #item.syncState="{ value }">
        <StatusIcon
          :status="value === 'ok' ? 'success': 'failure'"
          :tooltip="value"
        />
      </template>
    </v-data-table-virtual>
  </UiWidgetCard>
</template>

<style scoped lang="scss">
</style>
