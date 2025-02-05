<script setup lang="ts">
import { computed, ComputedRef, ref } from 'vue'
import { useQuery,useMutation } from '@vue/apollo-composable'
import { GetMarketClientAllowList, DeleteMarketClientAllow, ToggleMarketClientAllow } from '@/gql/market'
import { MarketAllowFilter } from '@/typed-graph'
import { IconReload } from '@tabler/icons-vue'
import SetClientAllow from './widgets/SetClientAllow.vue'

const headers = [
  { title: 'Wallet', key: 'wallet' },
  { title: 'Active', key: 'status' },
  { title: '    ', key: 'actions' },
]

const { result, loading, refetch } = useQuery(GetMarketClientAllowList, null, {})
const items: ComputedRef<[MarketAllowFilter]> = computed(() => result.value?.marketAllowFilters || [])
const defaultBehavior = computed(() => result.value?.marketAllowDefault ? " Allowed" : "Denied")

const searchValue = ref<string>()
const deletingItem = ref<string | null>(null)

const { mutate } = useMutation(DeleteMarketClientAllow, {
  refetchQueries: [{
    query: GetMarketClientAllowList,
  }],
})

const handleDelete = async (wallet: string) => {
  deletingItem.value = wallet
  try {
    await mutate({ wallet })
  } finally {
    deletingItem.value = null
  }
}

const toggleItem = ref<string | null>(null)
const { mutate: toggle } = useMutation(ToggleMarketClientAllow, {
  refetchQueries: [{
    query: GetMarketClientAllowList,
  }],
  awaitRefetchQueries: true,
})

const handleToggle = async (wallet: string) => {
  toggleItem.value = wallet
  try {
    await toggle({ wallet })
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
      <SetClientAllow action="add" />
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
      <template #top>
        <v-toolbar
          flat
        >
          <v-toolbar-title>Client Default Behaviour: {{ defaultBehavior }}</v-toolbar-title>
        </v-toolbar>
      </template>
      <template #item.status="{ item }">
        <v-switch
          color="primary"
          :model-value="item.status"
          :loading="toggleItem === item.wallet"
          @update:model-value="handleToggle(item.wallet)"
        />
      </template>
      <template #item.actions="{ item }">
        <SetClientAllow
          action="update"
          :item="item"
        />
        <v-btn
          class="ml-2"
          color="error"
          variant="elevated"
          :loading="deletingItem === item.wallet"
          @click="handleDelete(item.wallet)"
        >
          Remove
        </v-btn>
      </template>
    </v-data-table-virtual>
  </UiTableCard>
</template>
