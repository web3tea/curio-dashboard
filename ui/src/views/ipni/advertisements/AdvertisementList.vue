<script setup lang="ts">
import { ref, computed, watch, ComputedRef, onActivated, onDeactivated } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { GetAdvertisements } from '@/gql/advertisement'
import { IpniAdvertisement } from '@/typed-graph'
import { formatBytes } from '@/utils/helpers/formatBytes'
import { useI18n } from 'vue-i18n'
import {
  IconRefresh,
  IconCheck,
  IconMinus,
  IconX,
  IconFilterOff,
  IconFileSearch
} from '@tabler/icons-vue'

const { t } = useI18n()

const enabled = ref(true)
const itemsPerPage = ref(10)
const page = ref(1)
const offset = computed(() => {
  return (page.value - 1) * itemsPerPage.value
})

// filter
const provider = ref<string | undefined>(undefined)
const isSkip = ref<boolean | undefined>(undefined)
const isRemoved = ref<boolean | undefined>(undefined)

const statusOptions = [
  { title: t('ipni.status.all'), value: null },
  { title: t('ipni.status.indexed'), value: { isSkip: false, isRemoved: false } },
  { title: t('ipni.status.skipped'), value: { isSkip: true, isRemoved: false } },
  { title: t('ipni.status.removed'), value: { isSkip: undefined, isRemoved: true } }
]

const selectedStatusOption = ref(statusOptions[0])

watch(selectedStatusOption, (newValue) => {
  if (newValue.value === null) {
    isSkip.value = undefined
    isRemoved.value = undefined
  } else {
    isSkip.value = newValue.value?.isSkip
    isRemoved.value = newValue.value?.isRemoved
  }
  page.value = 1
})

const { result, loading, refetch } = useQuery(
  GetAdvertisements,
  () => ({
    offset: offset.value,
    limit: itemsPerPage.value,
    provider: provider.value,
    isSkip: isSkip.value,
    isRemoved: isRemoved.value,
  }),
  () => ({
    debounce: 500,
    enabled: enabled.value,
    pollInterval: 5000,
  })
)

onActivated(() => {
  enabled.value = true
})

onDeactivated(() => {
  enabled.value = false
})



const advertisements: ComputedRef<IpniAdvertisement[]> = computed(() => result.value?.ipniAdvertisements || [])
const itemsCount: ComputedRef<number> = computed(() => {
  return result.value?.ipniAdvertisementsCount || itemsCount.value || 0
})

const clearFilters = () => {
  provider.value = undefined
  isSkip.value = undefined
  isRemoved.value = undefined
  selectedStatusOption.value = statusOptions[0]
  page.value = 1
}

const getStatus = (ad: IpniAdvertisement) => {
  if (ad.isRm) {
    return {
      color: 'error',
      icon: IconX,
      text: t('ipni.status.removed')
    }
  }

  if (ad.isSkip) {
    return {
      color: 'grey',
      icon: IconMinus,
      text: t('ipni.status.skipped')
    }
  }

  return {
    color: 'success',
    icon: IconCheck,
    text: t('ipni.status.indexed')
  }
}

// Table headers
const headers = [
  { title: "Order Number", key: 'orderNumber', sortable: true },
  { title: "Piece CID", key: 'pieceCid', sortable: true },
  { title: "Provider", key: 'provider', sortable: true },
  { title: "Piece Size", key: 'pieceSize', sortable: true },
  { title: "Status", key: 'status', sortable: true }
]

</script>

<template>
  <v-card class="mb-4">
    <v-data-table-server
      v-model:page="page"
      v-model:items-per-page="itemsPerPage"
      :headers="headers"
      :items="advertisements"
      :items-length="itemsCount"
      :loading="loading"
      :items-per-page-options="[5, 10, 25, 50]"
      hover
    >
      <template #top>
        <v-toolbar
          flat
          color="transparent"
          class="pb-4 mb-2 border-b"
        >
          <v-toolbar-title>{{ t('ipni.advertisements') }}</v-toolbar-title>
          <v-spacer />

          <MinerSelectInput
            v-model="provider"
            label="Provider"
            density="compact"
            variant="outlined"
            hide-details
            class="mr-4"
            style="max-width: 180px;"
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
            No advertisements found
          </div>
        </div>
      </template>

      <template #item.pieceCid="{ value }">
        <TruncatedText
          :text="value"
          :max-length="30"
        />
      </template>

      <template #item.provider="{ item }">
        {{ item.provider?.spID || '-' }}
      </template>

      <template #item.pieceSize="{ item }">
        {{ item.pieceSize ? formatBytes(item.pieceSize).combined : '-' }}
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
    </v-data-table-server>
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
