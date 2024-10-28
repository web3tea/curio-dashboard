<script setup lang="ts">
import { VNumberInput } from 'vuetify/labs/VNumberInput'
import { useQuery } from '@vue/apollo-composable'
import { computed, ComputedRef, ref } from 'vue'
import { Actor, Sector, SectorLocation } from '@/typed-graph'
import { GetSectors } from '@/views/query/sector'
import { sealProofToSize } from '@/utils/helpers/sealProofToSize'
import { IconInfoCircle, IconReload } from '@tabler/icons-vue'

const page = ref(1)
const rowsPerPage = ref(50)

const selectedMiner = ref<string | null>(null)
const searchSectorNumber = ref<string | null>(null)

const { result, loading, refetch } = useQuery(GetSectors, {
  miner: selectedMiner.value,
  sectorNumber: searchSectorNumber.value !== null ? parseInt(searchSectorNumber.value) : null,
  offset: (page.value - 1) * rowsPerPage.value,
  limit: rowsPerPage.value,
}, () => ({
  fetchPolicy: 'cache-first',
}))

const items: ComputedRef<[Sector]> = computed(() => result.value?.sectors || [])
const miners: ComputedRef<[Actor]> = computed(() => result.value?.actors || [])

const headers = [
  { title: 'Miner', key: 'meta.spId' },
  { title: 'Sector', key: 'meta.sectorNum' },
  { title: 'Expiration', key: 'meta.expirationEpoch' },
  { title: 'Is CC', key: 'meta.isCC' },
  { title: 'Has Unsealed', key: 'hasUnsealed' },
  { title: 'Has Sealed', key: 'hasSealed' },
  { title: 'Size', key: 'meta.regSealProof' },
]

function handleRefetch (): void {
  refetch({
    miner: selectedMiner.value,
    sectorNumber: searchSectorNumber.value !== null ? parseInt(searchSectorNumber.value) : null,
    offset: (page.value - 1) * rowsPerPage.value,
    limit: rowsPerPage.value,
  })
}
</script>

<template>
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
                :disabled="!selectedMiner"
                hide-details
                hide-spin-buttons
                :min="0"
                placeholder="Sector Number"
                @keydown.enter="handleRefetch"
              />
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" md="3">
          <div class="d-flex ga-2 justify-end">
            <v-btn
              :icon="IconReload"
              round
              :rounded="true"
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
        :items="items"
        :loading="loading"
      >
        <template #item.meta.spId="{ item }">
          <RouterLink :to="{ name: 'SectorDetails', params: { miner: item.meta?.spId, sectorNumber: item.meta?.sectorNum } }">{{ item.meta?.spId }}</RouterLink>
        </template>
        <template #item.meta.sectorNum="{ item }">
          <RouterLink :to="{ name: 'SectorDetails', params: { miner: item.meta?.spId, sectorNumber: item.meta?.sectorNum } }">{{ item.meta?.sectorNum }}</RouterLink>
        </template>
        <template #item.meta.expirationEpoch="{ item }">
          {{ item.meta?.expirationEpoch }}
        </template>
        <template #item.meta.isCC="{ item }">
          {{ item.meta?.isCC ? 'Yes' : 'No' }}
        </template>
        <template #item.hasUnsealed="{ item }">
          <v-tooltip aria-label="tooltip" location="bottom">
            <template #activator="{ props }">
              {{ item.locations?.some((location: SectorLocation|null) => location?.sectorFiletype === 1) ? 'Yes' : 'No' }}
              <v-icon color="primary" v-bind="props">
                <IconInfoCircle />
              </v-icon>
            </template>
          </v-tooltip>
        </template>
        <template #item.hasSealed="{ item }">
          <v-tooltip aria-label="tooltip" location="bottom">
            <template #activator="{ props }">
              {{ item.locations?.some((location: SectorLocation|null) => location?.sectorFiletype === 2) ? 'Yes' : 'No' }}
              <v-icon color="primary" v-bind="props">
                <IconInfoCircle />
              </v-icon>
            </template>
          </v-tooltip>
        </template>
        <template #item.meta.regSealProof="{ item }">
          <v-tooltip aria-label="tooltip" location="bottom">
            <template #activator="{ props }">
              {{ sealProofToSize(item.meta?.regSealProof || 0) }}
              <v-icon color="primary" v-bind="props">
                <IconInfoCircle />
              </v-icon>
            </template>
          </v-tooltip>
        </template>
      </v-data-table-virtual>
    </v-card-text>
  </v-card>
</template>

<style scoped lang="scss">

</style>
