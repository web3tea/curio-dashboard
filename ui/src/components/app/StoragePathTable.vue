<script setup lang="ts">

import moment from 'moment'
import { formatBytes } from '@/utils/helpers/formatBytes'
import { EyeOutlined } from '@ant-design/icons-vue'
import { StoragePath } from '@/typed-graph'
import type { Header, Item } from 'vue3-easy-data-table'
import { ref } from 'vue'
import { ApolloError } from '@apollo/client'

const props = defineProps({
  items: {
    type: Array as () => StoragePath[],
    required: true,
  },
  loading: {
    type: Boolean,
    required: true,
  },
  error: {
    type: Object as () => ApolloError | null,
    required: false,
  },
  hideFooter: {
    type: Boolean,
    default: false,
  },
})

const itemsSelected = ref<Item[]>([])
const searchField = ref('storageId')
const searchValue = ref('')
const themeColor = ref('rgb(var(--v-theme-primary))')

const headers :Header[] = [
  { text: 'Type', value: 'type' },
  { text: 'Storage ID', value: 'storageId' },
  { text: 'URLs', value: 'urls' },
  { text: 'Weight', value: 'weight', sortable: true },
  { text: 'Capacity', value: 'capacity' },
  { text: 'Available', value: 'available' },
  { text: 'FS Available', value: 'fsAvailable' },
  { text: 'Reserved', value: 'reserved' },
  { text: 'Used', value: 'used' },
  { text: 'Last Heartbeat', value: 'lastHeartbeat' },
]
</script>

<template>
  <EasyDataTable
    v-model:items-selected="itemsSelected"
    :headers="headers"
    :hide-footer="props.hideFooter"
    :items="props.items"
    :loading="props.loading"
    :rows-per-page="100"
    :search-field="searchField"
    :search-value="searchValue"
    table-class-name="customize-table"
    :theme-color="themeColor"
  >
    <template #empty-message>
      <p class="text-high-emphasis">{{ error?.message || 'No Data' }} </p>
    </template>
    <template #item-id="{ id }">
      <div class="player-wrapper">
        <h5 class="text-h5">#{{ id }}</h5>
      </div>
    </template>
    <template #item-type="{ type }">
      <v-chip v-if="type === 'Hybrid'" color="success" label size="small"> Hybrid </v-chip>
      <v-chip v-if="type === 'Seal'" color="accent" label size="small"> Seal </v-chip>
      <v-chip v-if="type === 'Store'" color="warning" label size="small"> Store </v-chip>
      <v-chip v-if="type === 'Readonly'" color="info" label size="small"> Readonly </v-chip>
    </template>
    <template #item-lastHeartbeat="{ lastHeartbeat }">
      <div :title="lastHeartbeat">{{ moment(lastHeartbeat).calendar() }}</div>
    </template>
    <template #item-storageId="{ storageId }">
      <v-text-field
        class="pr-0"
        color="primary"
        hide-details
        min-width="200"
        :model-value="storageId"
        readonly
        single-line
        variant="outlined"
      />
    </template>
    <template #item-urls="{ urls }">
      <v-select
        color="primary"
        hide-details
        hide-no-data
        :items="urls.split(',')"
        :label="urls.split(',')[0]"
        min-width="200"
        single-line
        variant="outlined"
      />
    </template>
    <template #item-capacity="{ capacity }">
      <div>{{ formatBytes(capacity).combined }}</div>
    </template>
    <template #item-available="{ available }">
      <div>{{ formatBytes(available).combined }}</div>
    </template>
    <template #item-fsAvailable="{ fsAvailable }">
      <div>{{ formatBytes(fsAvailable).combined }}</div>
    </template>
    <template #item-reserved="{ reserved }">
      <div>{{ formatBytes(reserved).combined }}</div>
    </template>
    <template #item-used="{ used }">
      <div>{{ formatBytes(used).combined }}</div>
    </template>
    <template #item-operation="{}">
      <div class="operation-wrapper">
        <v-btn
          color="secondary"
          round
          rounded
          title="More"
          variant="text"
        >
          <EyeOutlined />
        </v-btn>
      </div>
    </template>
  </EasyDataTable>
</template>

<style scoped lang="scss">

</style>
