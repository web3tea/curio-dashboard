<script setup lang="ts">
import { GetStoragePaths } from '@/views/query/storage'
import { useQuery } from '@vue/apollo-composable'
import { StoragePath } from '@/typed-graph'
import { computed, ComputedRef, ref } from 'vue'
import { EyeOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons-vue'
import moment from 'moment/moment'
import { formatBytes } from '@/utils/helpers/formatBytes'
import type { Item } from 'vue3-easy-data-table'

const { result, loading, refetch, error } = useQuery(GetStoragePaths, null, () => ({
  fetchPolicy: 'cache-first',
}))

const items: ComputedRef<[StoragePath]> = computed(() => result.value?.storagePaths || [])
const headers = [
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

const filteredItems = computed(() => {
  return filteredItemsByType(tab.value).value
})

const filteredItemsByType = (type: string) => computed(() => {
  if (type === 'All') {
    return items.value
  }
  return items.value.filter(item => item.type === type)
})

const searchField = ref('storageId')
const searchValue = ref('')

const itemsSelected = ref<Item[]>([])
const themeColor = ref('rgb(var(--v-theme-primary))')
const tab = ref('All')

const tabs = [
  { text: 'All', color: 'accent' },
  { text: 'Seal', color: 'success' },
  { text: 'Store', color: 'warning' },
  { text: 'Hybrid', color: 'info' },
  { text: 'Readonly', color: 'error' },
]
</script>

<template>
  <v-row>
    <v-col cols="12" md="12">
      <v-card class="bg-surface" elevation="0" variant="outlined">
        <v-card-item>
          <v-row class="align-center" justify="space-between">
            <v-col cols="12" md="6">
              <v-tabs v-model="tab" color="primary">
                <template v-for="t in tabs" :key="t.text">
                  <v-tab class="font-weight-medium" :value="t.text">
                    {{ t.text }}
                    <v-chip
                      class="ml-2 font-weight-medium"
                      :color="t.color"
                      label
                      size="small"
                    >
                      {{ filteredItemsByType(t.text).value.length }}
                    </v-chip>
                  </v-tab>
                </template>
              </v-tabs>
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field
                v-model="searchValue"
                hide-details
                persistent-placeholder
                placeholder="Search"
                type="text"
                variant="outlined"
              >
                <template #prepend-inner>
                  <SearchOutlined :style="{ fontSize: '14px' }" />
                </template>
              </v-text-field>
            </v-col>
            <v-col cols="12" md="3">
              <div class="d-flex ga-2 justify-end">
                <v-btn round rounded variant="text" @click="refetch">
                  <ReloadOutlined />
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-card-item>
        <v-divider />
        <v-card-text class="pa-0">
          <EasyDataTable
            v-model:items-selected="itemsSelected"
            :headers="headers"
            :items="filteredItems"
            :loading="loading"
            :rows-per-page="100"
            :search-field="searchField"
            :search-value="searchValue"
            table-class-name="customize-table"
            :theme-color="themeColor"
          >
            <template #empty-message>
              <p class="text-high-emphasis">{{ error?.message || 'No Data' }} </p>
            </template>
            <template #[`item.id`]="{ id }">
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
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped lang="scss">

</style>
