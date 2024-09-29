<script setup lang="ts">
import moment from 'moment'
import { useQuery } from '@vue/apollo-composable'
import { SearchOutlined } from '@ant-design/icons-vue'
import { computed, ComputedRef, ref } from 'vue'
import { GetSectorsPoreps } from '@/views/query/porep'
import { Porep } from '@/typed-graph'
import type { Item } from 'vue3-easy-data-table'
import PipelineStatus from '@/views/widgets/data/PipelineStatus.vue'

const { result, loading, refetch, error } = useQuery(GetSectorsPoreps, null, () => ({
  fetchPolicy: 'cache-first',
}))
const items: ComputedRef<[Porep]> = computed(() => result.value?.poreps || [])
const headers = [
  { text: 'Miner', value: 'spId' },
  { text: 'Sector', value: 'sectorNumber' },
  { text: 'Created', value: 'createTime' },
  { text: 'Status', value: 'status' },
  { text: '', value: 'card' },
]

const searchField = ['spId', 'sectorNumber', 'status']
const searchValue = ref('')
const themeColor = ref('rgb(var(--v-theme-primary))')
const itemsSelected = ref<Item[]>([])
const selectStatus = ref(null)

const filterItems = computed(() => {
  return items.value.filter(item => {
    if (selectStatus.value && item.status !== selectStatus.value) {
      return false
    }
    return true
  })
})

const allStatus = computed(() => {
  const res = new Set<string>()
  items.value.forEach(item => {
    res.add(item.status)
  })
  return Array.from(res)
})

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
                <v-btn round rounded variant="text" @click="refetch">
                  <ReloadIcon />
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
            <template #empty-message>
              <p class="text-high-emphasis">{{ error?.message || 'No Data' }} </p>
            </template>
            <template #header-status="header">
              <v-autocomplete
                v-model="selectStatus"
                aria-label="autocomplete"
                class="remove-details"
                clear-icon="$close"
                clearable
                color="primary"
                :items="allStatus"
                :label="header.text.toUpperCase()"
                single-line
                variant="outlined"
              />
            </template>

            <template #item-sectorNumber="{spId, sectorNumber}">
              <RouterLink :to="{ name: 'SectorDetails', params: { miner: spId, sectorNumber: sectorNumber } }">{{ sectorNumber }}</RouterLink>
            </template>
            <template #item-status="item">
              <div class="mt-3 mb-2 text-subtitle-1">
                <span class="font-weight-semibold mr-2">Status :</span>
                <span class="text-medium-emphasis">
                  <v-chip
                    :color="item.status === 'Failed' ? 'error' : 'success'"
                    label
                    size="small"
                    variant="flat"
                  >{{ item.status }}</v-chip>
                </span>
              </div>

              <div class="text-subtitle-1">
                <span class="font-weight-semibold mr-2">Task ID :</span>
                <span class="text-medium-emphasis">{{ item.currentTask?.id }}</span>
              </div>
              <div class="text-subtitle-1">
                <span class="font-weight-semibold mr-2">Posted :</span>
                <span class="text-medium-emphasis">{{ moment(item.currentTask?.postedTime).calendar() }}</span>
              </div>
            </template>
            <template #item-createTime="{createTime}">
              {{ moment(createTime).format() }}
            </template>
            <template #item-card="item">
              <PipelineStatus :id="item.id" :sector="item" />
            </template>
          </EasyDataTable>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>

</template>

<style scoped lang="scss">

</style>
