<script setup lang="ts">
import { useQuery } from '@vue/apollo-composable'
import { GetSectorMeta } from '@/views/query/sector'
import { computed, ComputedRef, ref } from 'vue'
import { SectorMeta } from '@/typed-graph'
import UiChildCard from '@/components/shared/UiChildCard.vue'
import PiecesInfo from '@/views/sectors/PiecesInfo.vue'
import SectorLocations from '@/views/sectors/SectorLocations.vue'
import SectorEvents from '@/views/sectors/SectorEvents.vue'

const page = ref({ title: 'Sector Details' })
const breadcrumbs = ref([
  {
    title: 'Sectors',
    disabled: false,
    href: '/app/sectors',
  },
  {
    title: 'Sector Details',
    disabled: true,
    href: '#',
  },
])

const props = defineProps(
  {
    miner: {
      type: String,
      required: true,
    },
    sectorNumber: {
      type: String,
      required: true,
    },
  }
)

const { result, loading, refetch } = useQuery(GetSectorMeta, {
  miner: props.miner,
  sectorNumber: props.sectorNumber,
}, () => ({
  fetchPolicy: 'cache-first',
}))

const meta: ComputedRef<SectorMeta> = computed(() => result.value?.sector.meta || {})

</script>
<template>
  <BaseBreadcrumb :breadcrumbs="breadcrumbs" :title="page.title" />
  <v-row>
    <v-col cols="12">
      <UiChildCard :loading="loading" title="Sector Info">
        <template #action>
          <v-btn round :rounded="true" variant="text" @click="refetch">
            <ReloadIcon />
          </v-btn>
        </template>
        <div class="d-flex align-center flex-column flex-sm-row text-medium-emphasis ga-4">
          <div class="d-flex align-center">
            <UserIcon />
            <span class="text-subtitle-1 font-weight-medium ml-2">Miner: {{ meta.spId }}</span>
          </div>
          <div class="d-flex align-center">
            <BoxIcon />
            <span class="text-subtitle-1 font-weight-medium ml-2">Sector: {{ meta.sectorNum }}</span>
          </div>
          <div class="d-flex align-center">
            <TrashIcon />
            <span class="text-subtitle-1 font-weight-medium ml-2">IsCC: {{ meta.isCC ? 'Yes' : 'No' }}</span>
          </div>
        </div>
        <v-divider class="my-4" />
        <v-row>
          <v-col cols="12" sm="6">
            <h4 class="mb-2 text-h4">Basic</h4>
            <div class="mt-3 mb-2 text-subtitle-1">
              <span class="font-weight-semibold mr-2">expirationEpoch :</span>
              <span class="text-medium-emphasis">{{ meta.expirationEpoch }}</span>
            </div>
            <div class="mb-2 text-subtitle-1">
              <span class="font-weight-semibold mr-2">regSealProof :</span>
              <span class="text-medium-emphasis">{{ meta.regSealProof }}</span>
            </div>
            <div class="mb-2 text-subtitle-1">
              <span class="font-weight-semibold mr-2">sectorNumber :</span>
              <span class="text-medium-emphasis">{{ meta.sectorNum }}</span>
            </div>
            <div class="mb-2 text-subtitle-1">
              <span class="font-weight-semibold mr-2">seedEpoch :</span>
              <span class="text-medium-emphasis">{{ meta.seedEpoch }}</span>
            </div>
            <div class="mb-2 text-subtitle-1">
              <span class="font-weight-semibold mr-2">seedValue :</span>
              <span class="text-medium-emphasis">{{ meta.seedValue }}</span>
            </div>
            <div class="mb-2 text-subtitle-1">
              <span class="font-weight-semibold mr-2">ticketEpoch :</span>
              <span class="text-medium-emphasis">{{ meta.ticketEpoch }}</span>
            </div>
            <div class="mb-2 text-subtitle-1">
              <span class="font-weight-semibold mr-2">ticketValue :</span>
              <span class="text-medium-emphasis">{{ meta.ticketValue }}</span>
            </div>
          </v-col>
          <v-col cols="12" sm="6">
            <h4 class="mb-2 text-h4">Data</h4>
            <div class="mt-3 mb-2 text-subtitle-1">
              <span class="font-weight-semibold mr-2">curSealedCid :</span>
              <span class="text-medium-emphasis">{{ meta.curSealedCid }}</span>
            </div>
            <div class="mb-2 text-subtitle-1">
              <span class="font-weight-semibold mr-2">curUnsealedCid :</span>
              <span class="text-medium-emphasis">{{ meta.curUnsealedCid }}</span>
            </div>
            <div class="mb-2 text-subtitle-1">
              <span class="font-weight-semibold mr-2">precommitCid :</span>
              <span class="text-medium-emphasis">{{ meta.msgCidPrecommit }}</span>
            </div>
            <div class="mb-2 text-subtitle-1">
              <span class="font-weight-semibold mr-2">commitCid :</span>
              <span class="text-medium-emphasis">{{ meta.msgCidCommit }}</span>
            </div>
            <div class="mb-2 text-subtitle-1">
              <span class="font-weight-semibold mr-2">origUnsealedCid :</span>
              <span class="text-medium-emphasis">{{ meta.origUnsealedCid }}</span>
            </div>
            <div class="mb-2 text-subtitle-1">
              <span class="font-weight-semibold mr-2">origSealedCid :</span>
              <span class="text-medium-emphasis">{{ meta.origSealedCid }}</span>
            </div>
            <div class="mb-2 text-subtitle-1">
              <span class="font-weight-semibold mr-2">updateCid :</span>
              <span class="text-medium-emphasis">{{ meta.msgCidUpdate }}</span>
            </div>
          </v-col>
        </v-row>
        <v-divider class="my-4" />
      </UiChildCard>
    </v-col>
    <v-col cols="12">
      <PiecesInfo :miner="miner" :sector-number="sectorNumber" />
    </v-col>
    <v-col cols="8">
      <SectorLocations :miner="miner" :sector-number="sectorNumber" />
    </v-col>
    <v-col cols="4">
      <SectorEvents :miner="miner" :sector-number="sectorNumber" />
    </v-col>
  </v-row>
</template>

<style scoped lang="scss">

</style>
