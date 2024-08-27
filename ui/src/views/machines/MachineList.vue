<script setup lang="ts">
import { computed, ComputedRef, ref } from 'vue'
import moment from 'moment'
import type { Header, Item } from 'vue3-easy-data-table'
import { EyeOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons-vue'
import { useQuery } from '@vue/apollo-composable'
import { GetMachines } from '@/views/query/machine'
import { Machine } from '@/typed-graph'
import { formatBytes } from '@/utils/helpers/formatBytes'

const { result, loading, refetch } = useQuery(GetMachines, null, () => ({
  fetchPolicy: 'cache-first',
  pollInterval: 10000,
}))
const items: ComputedRef<[Machine]> = computed(() => result.value?.machines || [])

const searchField = ref('hostAndPort')
const searchValue = ref('')

const headers: Header[] = [
  { text: 'ID', value: 'id', sortable: true },
  { text: 'Name', value: 'detail.machineName' },
  { text: 'Last Contact', value: 'lastContact', sortable: true },
  { text: 'Startup', value: 'detail.startupTime', sortable: true },
  { text: 'CPU', value: 'cpu', sortable: true },
  { text: 'GPU', value: 'gpu', sortable: true },
  { text: 'RAM', value: 'ram' },
  { text: 'Host and Port', value: 'hostAndPort' },
  { text: 'Action', value: 'operation' },
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
            :items="items"
            :loading="loading"
            :rows-per-page="100"
            :search-field="searchField"
            :search-value="searchValue"
            table-class-name="customize-table"
            :theme-color="themeColor"
          >
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
