<script setup lang="ts">
import { ref, computed, watch, ComputedRef } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { IpniProvider } from '@/typed-graph'
import { useI18n } from 'vue-i18n'
import {
  IconRefresh,
  IconCircleCheck,
  IconCircleX,
  IconQuestionMark,
  IconFilterOff,
  IconFileSearch
} from '@tabler/icons-vue'

const { t } = useI18n()

const search = ref('')

// filter
const status = ref<string | undefined>(undefined)

const statusOptions = ref([
  { title: t('ipni.status.all'), value: undefined },
  { title: t('ipni.status.active'), value: 'ACTIVE' },
  { title: t('ipni.status.inactive'), value: 'INACTIVE' },
  { title: t('ipni.status.unknown'), value: 'UNKNOWN' }
])

const selectedStatusOption = ref(statusOptions.value[0])

watch(selectedStatusOption, (newValue) => {
  status.value = newValue.value
})

const { result, loading, refetch } = useQuery(
  gql`
    query GetIPNIProviders {
      ipniProviders {
        spID
        peerID
        head
        adCount
        status
      }
    }
  `,
  {},
  {
    debounce: 500,
  }
)

const allProviders: ComputedRef<IpniProvider[]> = computed(() => result.value?.ipniProviders || [])

// Filter providers based on selected status
const filteredProviders = computed(() => {
  let providers = [...allProviders.value]

  // Filter by status if selected
  if (status.value) {
    providers = providers.filter(provider => provider.status === status.value)
  }

  return providers
})

const clearFilters = () => {
  search.value = ''
  status.value = undefined
  selectedStatusOption.value = statusOptions.value[0]
}

// Status mapping for providers
const getStatus = (provider: IpniProvider) => {
  switch (provider.status) {
  case 'ACTIVE':
    return {
      color: 'success',
      icon: IconCircleCheck,
      text: t('ipni.status.active')
    }
  case 'INACTIVE':
    return {
      color: 'error',
      icon: IconCircleX,
      text: t('ipni.status.inactive')
    }
  default:
    return {
      color: 'grey',
      icon: IconQuestionMark,
      text: t('ipni.status.unknown')
    }
  }
}

// Table headers
const headers = [
  { title: "SP ID", key: 'spID', sortable: true },
  { title: "Peer ID", key: 'peerID', sortable: false },
  { title: "Head", key: 'head', sortable: false },
  { title: "Ads Count", key: 'adCount', sortable: true },
  { title: "Status", key: 'status', sortable: true }
]

</script>

<template>
  <v-card class="mb-4">
    <v-data-table-virtual
      :headers="headers"
      :items="filteredProviders"
      :search="search"
      :loading="loading"
      hover
      fixed-header
    >
      <template #top>
        <v-toolbar
          flat
          color="transparent"
          class="pb-4 mb-2 border-b"
        >
          <v-toolbar-title>{{ t('ipni.providers') }}</v-toolbar-title>
          <v-spacer />

          <v-text-field
            v-model="search"
            append-inner-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
            density="compact"
            style="max-width: 250px;"
            class="mr-4"
            variant="outlined"
          />

          <v-select
            v-model="selectedStatusOption"
            :items="statusOptions"
            item-title="title"
            item-value="value"
            label="Status"
            variant="outlined"
            density="compact"
            hide-details
            return-object
            style="max-width: 150px;"
            class="mr-4"
          />

          <v-btn
            variant="text"
            color="error"
            :prepend-icon="IconFilterOff"
            class="mr-2"
            @click="clearFilters"
          >
            Clear
          </v-btn>

          <v-btn
            variant="text"
            color="primary"
            :icon="IconRefresh"
            :loading="loading"
            @click="refetch"
          />
        </v-toolbar>
      </template>

      <template #no-data>
        <div class="pa-8 text-center">
          <v-icon
            size="48"
            class="mb-2 text-medium-emphasis"
          >
            <component :is="IconFileSearch" />
          </v-icon>
          <div class="text-medium-emphasis">
            No providers found
          </div>
        </div>
      </template>

      <template #item.peerID="{ value }">
        <TruncatedText
          :text="value"
          :max-length="30"
        />
      </template>

      <template #item.head="{ value }">
        <TruncatedText
          :text="value"
          :max-length="30"
        />
      </template>

      <template #item.status="{ item }">
        <v-chip
          :color="getStatus(item).color"
          size="small"
          variant="tonal"
          class="text-none"
        >
          <component
            :is="getStatus(item).icon"
            class="mr-1"
            size="14"
          />
          {{ getStatus(item).text }}
        </v-chip>
      </template>
    </v-data-table-virtual>
  </v-card>
</template>

<style scoped>
/* Ensure consistent column widths */
:deep(th) {
  white-space: nowrap;
}

/* Add pointer cursor to rows */
:deep(.v-data-table tbody tr) {
  cursor: pointer;
}

/* Full width table */
:deep(.v-data-table) {
  width: 100%;
}

/* Details table styling */
:deep(.v-table th) {
  width: 150px;
  text-align: left;
  vertical-align: top;
}

:deep(.v-table td) {
  word-break: break-all;
}
</style>
