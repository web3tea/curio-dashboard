<script setup lang="ts">
import moment from 'moment'
import { useQuery } from '@vue/apollo-composable'
import { computed, ComputedRef, ref } from 'vue'
import { GetSectorsPoreps } from '@/views/query/porep'
import { Porep } from '@/typed-graph'
import PipelineStatus from '@/views/widgets/data/PipelineStatus.vue'
import { IconReload, IconSearch } from '@tabler/icons-vue'

const { result, loading, refetch } = useQuery(GetSectorsPoreps, null, () => ({
  fetchPolicy: 'cache-first',
}))
const items: ComputedRef<[Porep]> = computed(() => result.value?.poreps || [])
const headers = [
  { title: 'Miner', key: 'spId' },
  { title: 'Sector', key: 'sectorNumber' },
  { title: 'Created', key: 'createTime' },
  { title: 'Status', key: 'status' },
  { title: '', key: 'card' },
]

const searchValue = ref('')
const selectStatus = ref(null)

const filterItems = computed(() => {
  return items.value.filter(item => {
    return !(selectStatus.value && item.status !== selectStatus.value)
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
                  <IconSearch :size="14" />
                </template>
              </v-text-field>
            </v-col>
            <v-col cols="12" md="3">
              <div class="d-flex ga-2 justify-end">
                <v-btn
                  :icon="IconReload"
                  round
                  rounded
                  variant="text"
                  @click="refetch"
                />
              </div>
            </v-col>
          </v-row>
        </v-card-item>
        <v-divider />
        <v-card-text class="pa-0">
          <v-data-table-virtual
            :headers="headers"
            hover
            :items="filterItems"
            :loading="loading"
            :search="searchValue"
          >
            <template #header.status="{ column }">
              <v-autocomplete
                v-model="selectStatus"
                aria-label="autocomplete"
                class="remove-details"
                clear-icon="$close"
                clearable
                color="primary"
                :items="allStatus"
                :label="column?.title?.toUpperCase()"
                single-line
                variant="outlined"
              />
            </template>
            <template #item.sectorNumber="{ item }">
              <RouterLink :to="{ name: 'SectorDetails', params: { miner: item.spId, sectorNumber: item.sectorNumber } }">{{ item.sectorNumber }}</RouterLink>
            </template>
            <template #item.status="{ item }">
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
            <template #item.createTime="{value}">
              {{ moment(value).format() }}
            </template>
            <template #item.card="{item}">
              <PipelineStatus :id="item.id" :sector="item" />
            </template>
          </v-data-table-virtual>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>

</template>

<style scoped lang="scss">

</style>
c
