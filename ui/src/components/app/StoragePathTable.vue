<script setup lang="ts">

import { formatBytes } from '@/utils/helpers/formatBytes'
import { StoragePath } from '@/typed-graph'
import { ApolloError } from '@apollo/client'
import { getColorByType } from '@/utils/helpers/storageTypeColor'

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
  search: {
    type: String,
    required: false,
  },
})

const headers = [
  { title: 'Type', key: 'type' },
  { title: 'Storage ID', key: 'storageId', sortable: false },
  { title: 'URLs', key: 'urls', sortable: false },
  { title: 'Weight', key: 'weight' },
  { title: 'Capacity', key: 'capacity' },
  { title: 'Available', key: 'available' },
  { title: 'FS Available', key: 'fsAvailable' },
  { title: 'Reserved', key: 'reserved' },
  { title: 'Used', key: 'used' },
  { title: 'Last Heartbeat', key: 'lastHeartbeat' },
]

</script>

<template>
  <v-data-table-virtual
    fixed-header
    :headers="headers"
    :items="props.items"
    :loading="props.loading"
    :search="props.search"
  >
    <template #item.type="{ value }">
      <v-chip :color="getColorByType(value)" label size="small"> {{ value }} </v-chip>
    </template>
    <template #item.lastHeartbeat="{ value }">
      {{ $d(value, 'short') }}
    </template>
    <template #item.storageId="{ value }">
      <v-text-field
        class="pr-0"
        color="primary"
        hide-details
        min-width="200"
        :model-value="value"
        readonly
        single-line
        variant="outlined"
      />
    </template>
    <template #item.urls="{ value }">
      <v-select
        color="primary"
        hide-details
        hide-no-data
        :items="value.split(',')"
        :label="value.split(',')[0]"
        min-width="200"
        single-line
        variant="outlined"
      />
    </template>
    <template #item.capacity="{ value }">
      <div>{{ formatBytes(value).combined }}</div>
    </template>
    <template #item.available="{ value }">
      <div>{{ formatBytes(value).combined }}</div>
    </template>
    <template #item.fsAvailable="{ value }">
      <div>{{ formatBytes(value).combined }}</div>
    </template>
    <template #item.reserved="{ value }">
      <div>{{ formatBytes(value).combined }}</div>
    </template>
    <template #item.used="{ value }">
      <div>{{ formatBytes(value).combined }}</div>
    </template>
  </v-data-table-virtual>
</template>

<style scoped lang="scss">

</style>
