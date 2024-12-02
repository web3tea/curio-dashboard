<script setup lang="ts">
import { useQuery } from '@vue/apollo-composable'
import { computed, ComputedRef, reactive, ref } from 'vue'
import { Sector } from '@/typed-graph'
import { GetSectors } from '@/gql/sector'
import { IconInfoCircle, IconReload } from '@tabler/icons-vue'
import SectorLocations from '@/views/sectors/SectorLocations.vue'
import { sealProofToSize } from '@/utils/helpers/sealProofToSize'
import EpochField from '@/components/app/EpochField.vue'
import type { MaskInputOptions } from 'maska'

const limit = ref(100)
const page = ref(1)
const offset = computed(() => (page.value - 1) * limit.value)

const selectedMiner = ref<string>()
const searchSectorNumber = ref<number>()
const searchSectorNumberCache = ref<number>()

function enterSearch (): void {
  searchSectorNumber.value = searchSectorNumberCache.value
}

const { result, loading, refetch } = useQuery(GetSectors, {
  miner: selectedMiner,
  sectorNumber: searchSectorNumber,
  offset: offset.value,
  limit: limit.value,
}, () => ({
  fetchPolicy: 'cache-first',
}))

const items: ComputedRef<[Sector]> = computed(() => result.value?.sectors || [])
const itemsCount: ComputedRef<number> = computed(() => {
  if (searchSectorNumber.value) {
    return items.value.length
  }
  return result.value?.sectorsCount || itemsCount.value || 0
})

const headers = [
  { title: 'Miner', key: 'meta.spId' },
  { title: 'Sector', key: 'meta.sectorNum' },
  { title: 'Expiration', key: 'meta.expirationEpoch' },
  { title: 'Is CC', key: 'meta.isCC' },
  { title: 'Has Unsealed', key: 'hasUnsealed' },
  { title: 'Has Sealed', key: 'hasSealed' },
  { title: 'Size', key: 'meta.regSealProof' },
]
const options = reactive<MaskInputOptions>({
  number: { unsigned: true, fraction: 0 },
  postProcess: value => {
    return value.replace(/,/g, '')
  },
})
</script>

<template>
  <v-card class="bg-surface" elevation="0" variant="outlined">
    <v-card-item>
      <v-row class="align-center" justify="space-between">
        <v-col cols="12" md="6">
          <v-row>
            <v-col cols="12" md="3">
              <MinerSelectInput v-model="selectedMiner" />
            </v-col>
            <v-col cols="6" md="3">
              <v-text-field
                v-model="searchSectorNumberCache"
                v-maska="options"
                clearable
                color="primary"
                data-maska-number
                :disabled="!selectedMiner"
                hide-details
                label="Sector Number"
                single-line
                variant="outlined"
                @keydown.enter="enterSearch"
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
      <v-data-table-server
        v-model:items-per-page="limit"
        v-model:page="page"
        fixed-header
        :headers="headers"
        height="calc(100vh - 300px)"
        hover
        :items="items"
        :items-length="itemsCount"
        :loading="loading"
      >
        <template #item.meta.spId="{ value }">
          <RouterLink :to="{ name: 'MinerDetails', params: { id: value } }">{{ value }}</RouterLink>
        </template>
        <template #item.meta.sectorNum="{ item }">
          <RouterLink :to="{ name: 'SectorDetails', params: { miner: item.meta?.spId, sectorNumber: item.meta?.sectorNum } }">{{ item.meta?.sectorNum }}</RouterLink>
        </template>
        <template #item.meta.expirationEpoch="{ item }">
          <EpochField :epoch="item.meta?.expirationEpoch" />
        </template>
        <template #item.meta.isCC="{ item }">
          {{ item.meta?.isCC ? 'Yes' : 'No' }}
        </template>
        <template #item.hasUnsealed="{ item }">
          <v-dialog>
            <template #activator="{ props }">
              {{ item.locations?.some(location => location?.sectorFiletype === 1) ? 'Yes' : 'No' }}
              <v-icon v-if="item.locations?.some(location => location?.sectorFiletype === 1)" color="primary" v-bind="props">
                <IconInfoCircle />
              </v-icon>
            </template>
            <template #default="{ }">
              <SectorLocations :miner="item.spID" :sector-number="item.sectorNum" />
            </template>
          </v-dialog>
        </template>
        <template #item.hasSealed="{ item }">
          <v-dialog>
            <template #activator="{ props }">
              {{ item.locations?.some(location => location?.sectorFiletype === 2) ? 'Yes' : 'No' }}
              <v-icon v-if="item.locations?.some(location => location?.sectorFiletype === 2)" color="primary" v-bind="props">
                <IconInfoCircle />
              </v-icon>
            </template>

            <template #default="{ }">
              <SectorLocations :miner="item.spID" :sector-number="item.sectorNum" />
            </template>
          </v-dialog>
        </template>
        <template #item.meta.regSealProof="{ item }">
          {{ sealProofToSize(item.meta?.regSealProof || 0) }}
        </template>
      </v-data-table-server>
    </v-card-text>
  </v-card>
</template>

<style scoped lang="scss">
</style>
