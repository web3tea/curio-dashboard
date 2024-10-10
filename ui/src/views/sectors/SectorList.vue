<script setup lang="ts">
import { VNumberInput } from 'vuetify/labs/VNumberInput'
import { useQuery } from '@vue/apollo-composable'
import { computed, ComputedRef, ref, watch } from 'vue'
import { Actor, Sector, SectorLocation } from '@/typed-graph'
import type { Header, Item, ServerOptions } from 'vue3-easy-data-table'
import { GetSectors } from '@/views/query/sector'
import { sealProofToSize } from '@/utils/helpers/sealProofToSize'
import { IconEye, IconInfoCircle, IconReload } from '@tabler/icons-vue'

const serverOptions = ref<ServerOptions>({
  page: 1,
  rowsPerPage: 10,
})

const selectedMiner = ref<string | null>(null)
const searchSectorNumber = ref<string | null>(null)

const { result, loading, refetch, error } = useQuery(GetSectors, {
  miner: selectedMiner.value,
  sectorNumber: searchSectorNumber.value !== null ? parseInt(searchSectorNumber.value) : null,
  offset: (serverOptions.value.page - 1) * serverOptions.value.rowsPerPage,
  limit: serverOptions.value.rowsPerPage,
}, () => ({
  fetchPolicy: 'cache-first',
}))

const items: ComputedRef<[Sector]> = computed(() => result.value?.sectors || [])
const miners: ComputedRef<[Actor]> = computed(() => result.value?.actors || [])
const itemsCount: ComputedRef<number> = computed(() => result.value?.sectorsCount || 0)

const headers :Header[] = [
  { text: 'Miner', value: 'meta.spId' },
  { text: 'Sector', value: 'meta.sectorNum' },
  { text: 'Expiration', value: 'meta.expirationEpoch' },
  { text: 'Is CC', value: 'meta.isCC' },
  { text: 'Has Unsealed', value: 'hasUnsealed' },
  { text: 'Has Sealed', value: 'hasSealed' },
  { text: 'Size', value: 'meta.regSealProof' },
  { text: 'action', value: 'action' },
]

const itemsSelected = ref<Item[]>([])
const themeColor = ref('rgb(var(--v-theme-primary))')

function handleRefetch (): void {
  refetch({
    miner: selectedMiner.value,
    sectorNumber: searchSectorNumber.value !== null ? parseInt(searchSectorNumber.value) : null,
    offset: (serverOptions.value.page - 1) * serverOptions.value.rowsPerPage,
    limit: serverOptions.value.rowsPerPage,
  })
}

watch(serverOptions, () => {
  handleRefetch()
}, { deep: true })

function formatLocationDetails (location: SectorLocation): string {
  if (location) {
    return `Storage ID:  ${location.storageId}`
  }
  return ''
}

</script>

<template>
  <v-row>
    <v-col cols="12" md="12">
      <v-card class="bg-surface" elevation="0" variant="outlined">
        <v-card-item>
          <v-row class="align-center" justify="space-between">
            <v-col cols="12" md="6">
              <v-row>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="selectedMiner"
                    clearable
                    color="primary"
                    density="compact"
                    item-title="address"
                    :items="miners"
                    label="Miner"
                    role="link"
                    single-line
                    variant="outlined"
                  />
                </v-col>
                <v-col cols="6" md="4">
                  <VNumberInput
                    v-model="searchSectorNumber"
                    clearable
                    color="primary"
                    control-variant="stacked"
                    :disabled="!selectedMiner"
                    hide-details
                    hide-spin-buttons
                    :min="0"
                    placeholder="Search Sector Number"
                  />
                </v-col>
                <v-col cols="6" md="2">
                  <v-btn
                    class="mt-1"
                    color="primary"
                    density="default"
                    :disabled="!searchSectorNumber"
                    flat
                    @click="handleRefetch"
                  >
                    Search
                  </v-btn>
                </v-col></v-row>
            </v-col>
            <v-col cols="12" md="3">
              <div class="d-flex ga-2 justify-end">
                <v-btn round :rounded="true" variant="text" @click="refetch">
                  <IconReload />
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-card-item>
        <v-divider />
        <v-card-text class="pa-0">
          <EasyDataTable
            v-model:items-selected="itemsSelected"
            v-model:server-options="serverOptions"
            :headers="headers"
            :items="items"
            :loading="loading"
            :server-items-length="itemsCount"
            table-class-name="customize-table"
            :theme-color="themeColor"
          >
            <template #empty-message>
              <p class="text-high-emphasis">{{ error?.message || 'No Data' }} </p>
            </template>
            <template #item-meta.sectorNum="{ meta }">
              <RouterLink :to="{ name: 'SectorDetails', params: { miner: meta.spId, sectorNumber: meta.sectorNum } }">{{ meta.sectorNum }}</RouterLink>
            </template>
            <template #item-hasSealed="{ locations }">
              <v-tooltip aria-label="tooltip" location="bottom">
                <template #activator="{ props }">
                  {{ locations.some((location: SectorLocation) => location.sectorFiletype === 2) ? 'Yes' : 'No' }}
                  <v-icon color="primary" v-bind="props">
                    <IconInfoCircle />
                  </v-icon>
                </template>
                <span>
                  {{ formatLocationDetails(locations.find((location: SectorLocation) => location.sectorFiletype === 2)) }}
                </span>
              </v-tooltip>
            </template>
            <template #item-hasUnsealed="{ locations }">
              <v-tooltip aria-label="tooltip" location="bottom">
                <template #activator="{ props }">
                  {{ locations.some((location: SectorLocation) => location.sectorFiletype === 1) ? 'Yes' : 'No' }}
                  <v-icon color="primary" v-bind="props">
                    <IconInfoCircle />
                  </v-icon>
                </template>
                <span>
                  {{ formatLocationDetails(locations.find((location: SectorLocation) => location.sectorFiletype === 1)) }}
                </span>
              </v-tooltip>
            </template>
            <template #item-meta.regSealProof="{ meta }">
              <v-tooltip aria-label="tooltip" location="bottom">
                <template #activator="{ props }">
                  {{ sealProofToSize(meta.regSealProof) }}
                  <v-icon color="primary" v-bind="props">
                    <IconInfoCircle />
                  </v-icon>
                </template>
                <span>
                  regSealProof: {{ meta.regSealProof }}
                </span>
              </v-tooltip>
            </template>
            <template #item-action="{ meta }">
              <div class="operation-wrapper">
                <RouterLink :to="{ name: 'SectorDetails', params: { miner: meta.spId, sectorNumber: meta.sectorNum } }">
                  <IconEye />
                </RouterLink>

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
