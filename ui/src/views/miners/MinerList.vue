<script setup lang="ts">

import { EyeIcon, ReloadIcon, SearchIcon } from 'vue-tabler-icons'
import { useQuery } from '@vue/apollo-composable'
import { computed, ComputedRef, ref } from 'vue'
import { Actor } from '@/typed-graph'
import type { Header, Item } from 'vue3-easy-data-table'
import { GetActors } from '@/views/query/miner'
import { formatFIL } from '@/utils/helpers/formatFIL'
import { formatBytes } from '@/utils/helpers/formatBytes'

const { result, loading, refetch, error } = useQuery(GetActors, null, () => ({
  fetchPolicy: 'cache-first',
}))
const items: ComputedRef<[Actor]> = computed(() => result.value?.actors || [])

const searchField = ref('address')
const searchValue = ref('')
const itemsSelected = ref<Item[]>([])
const themeColor = ref('rgb(var(--v-theme-primary))')

const headers :Header[] = [
  { text: 'Address', value: 'address' },
  { text: 'Layers', value: 'layers' },
  { text: 'Balance', value: 'actorBalance' },
  { text: 'Available Balance', value: 'actorAvailableBalance' },
  { text: 'Worker Balance', value: 'workerBalance' },
  { text: 'QA Power', value: 'qualityAdjustedPower' },
  { text: 'RAW Power', value: 'rawBytePower' },
  { text: 'action', value: 'action' },
]

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
                  <SearchIcon />
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
            :items="items"
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
            <template #item-actorBalance="{ actorBalance }">
              {{ formatFIL(actorBalance) }}
            </template>
            <template #item-actorAvailableBalance="{ actorAvailableBalance }">
              {{ formatFIL(actorAvailableBalance) }}
            </template>
            <template #item-workerBalance="{ workerBalance }">
              {{ formatFIL(workerBalance) }}
            </template>
            <template #item-qualityAdjustedPower="{ qualityAdjustedPower }">
              {{ formatBytes(qualityAdjustedPower).combined }}
            </template>
            <template #item-rawBytePower="{ rawBytePower }">
              {{ formatBytes(rawBytePower).combined }}
            </template>
            <template #item-action="{}">
              <div class="operation-wrapper">
                <v-btn
                  color="secondary"
                  round
                  rounded
                  title="More"
                  variant="text"
                >
                  <EyeIcon />
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
