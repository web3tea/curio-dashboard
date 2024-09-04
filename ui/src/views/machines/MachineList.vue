<script setup lang="ts">
import { computed, ComputedRef, ref } from 'vue'
import moment from 'moment'
import type { Header, Item } from 'vue3-easy-data-table'
import { EyeOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons-vue'
import { useQuery } from '@vue/apollo-composable'
import { GetMachines } from '@/views/query/machine'
import { Machine } from '@/typed-graph'
import { formatBytes } from '@/utils/helpers/formatBytes'

const { result, loading, refetch, error } = useQuery(GetMachines, null, () => ({
  fetchPolicy: 'cache-first',
  pollInterval: 10000,
}))
const items: ComputedRef<[Machine]> = computed(() => result.value?.machines || [])

const allLayers = computed(() => {
  const layers = new Set<string>()
  items.value.forEach(item => {
    item.detail?.layers.split(',').forEach(layer => {
      layers.add(layer)
    })
  })
  return Array.from(layers)
})

const allSupportTasks = computed(() => {
  const tasks = new Set<string>()
  items.value.forEach(item => {
    item.detail?.tasks.split(',').forEach(task => {
      tasks.add(task)
    })
  })
  return Array.from(tasks)
})
const searchField = ref('hostAndPort')
const searchValue = ref('')
const selectLayer = ref('')
const selectSupportTask = ref('')

const filterItems = computed(() => {
  return items.value.filter(item => {
    if (selectLayer.value && !item.detail?.layers.includes(selectLayer.value)) {
      return false
    }
    return !(selectSupportTask.value && !item.detail?.tasks.includes(selectSupportTask.value))
  })
})

const headers: Header[] = [
  { text: 'ID', value: 'id' },
  { text: 'Name', value: 'detail.machineName' },
  { text: 'Last Contact', value: 'lastContact', sortable: true },
  { text: 'Startup', value: 'detail.startupTime', sortable: true },
  { text: 'CPU', value: 'cpu', sortable: true },
  { text: 'GPU', value: 'gpu', sortable: true },
  { text: 'RAM', value: 'ram', sortable: true },
  { text: 'Host and Port', value: 'hostAndPort' },
  { text: 'Layers', value: 'detail.layers' },
  { text: 'Support Tasks', value: 'detail.tasks' },
]

const themeColor = ref('rgb(var(--v-theme-primary))')
const itemsSelected = ref<Item[]>([])
</script>

<template>
  <v-row>
    <v-col cols="12" md="12">
      <v-card class="bg-surface" elevation="0" variant="outlined">
        <v-card-item>
          <v-row class="align-center" justify="space-between">
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
                <v-btn round rounded="true" variant="text" @click="refetch">
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
            :items="filterItems"
            :loading="loading"
            :rows-per-page="100"
            :search-field="searchField"
            :search-value="searchValue"
            table-class-name="customize-table"
            :theme-color="themeColor"
          >
            <template #header-detail.layers="header">
              <v-autocomplete
                v-model="selectLayer"
                aria-label="autocomplete"
                class="remove-details"
                clear-icon="$close"
                clearable
                color="primary"
                :items="allLayers"
                :label="header.text.toUpperCase()"
                single-line
                variant="outlined"
              />
            </template>
            <template #header-detail.tasks="header">
              <v-autocomplete
                v-model="selectSupportTask"
                aria-label="autocomplete"
                class="remove-details"
                clear-icon="$close"
                clearable
                color="primary"
                :items="allSupportTasks"
                :label="header.text.toUpperCase()"
                single-line
                variant="outlined"
              />
            </template>
            <template #empty-message>
              <p class="text-high-emphasis">{{ error?.message || 'No Data' }} </p>
            </template>
            <template #[`item.id`]="{ id }">
              <div class="player-wrapper">
                <h5 class="text-h5">#{{ id }}</h5>
              </div>
            </template>
            <template #item-lastContact="{ lastContact }">
              <div :title="lastContact">{{ moment(lastContact).calendar() }}</div>
            </template>
            <template #item-detail.startupTime="{ detail }">
              <div :title="detail.startupTime">{{ moment(detail.startupTime).calendar() }}</div>
            </template>
            <template #item-ram="{ ram }">
              <div>{{ formatBytes(ram).combined }}</div>
            </template>
            <template #item-detail.layers="{ detail }">
              <v-chip-group column>
                <v-chip v-for="layer in detail.layers.split(',')" :key="layer">{{ layer }}</v-chip>
              </v-chip-group>
            </template>
            <template #item-detail.tasks="{ detail }">
              <v-chip-group column>
                <v-chip v-for="task in detail.tasks.split(',')" :key="task">{{ task }}</v-chip>
              </v-chip-group>
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
