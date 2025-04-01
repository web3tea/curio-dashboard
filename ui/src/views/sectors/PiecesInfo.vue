<script setup lang="ts">
import { SectorMetaPiece } from '@/typed-graph'
import { useQuery } from '@vue/apollo-composable'
import { GetSectorPieces } from '@/gql/sector'
import { computed, ComputedRef } from 'vue'
import UiChildCard from '@/components/shared/UiChildCard.vue'
import { formatBytes } from '@/utils/helpers/formatBytes'
import { IconReload } from '@tabler/icons-vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  miner: {
    type: String,
    required: true,
  },
  sectorNumber: {
    type: Number,
    required: true,
  },
})

const { result, loading, refetch } = useQuery(GetSectorPieces, {
  miner: props.miner,
  sectorNumber: props.sectorNumber,
}, () => ({
  fetchPolicy: 'cache-first',
}))

const pieces: ComputedRef<[SectorMetaPiece]> = computed(() => result.value?.sector.pieces || [])

const headers = [
  { title: 'Piece', key: 'pieceNum' },
  { title: 'StartEpoch', key: 'startEpoch' },
  { title: 'EndEpoch', key: 'origEndEpoch' },
  { title: 'Raw Data Size', key: 'rawDataSize' },
  { title: 'Piece Size', key: 'pieceSize' },
  { title: 'Piece CID', key: 'pieceCID' },
  { title: 'Keep Data', key: 'requestedKeepData', align: 'center' },
  { title: 'f05 DealID', key: 'f05DealID' },
  { title: 'f05 DealProposal', key: 'f05DealProposal', align: 'center' },
  { title: 'ddo Pam', key: 'ddoPam', align: 'center' },
] as const

</script>

<template>
  <UiChildCard :title="t('fields.Pieces Info')">
    <template #action>
      <v-btn
        :icon="IconReload"
        rounded
        variant="text"
        @click="refetch"
      />
    </template>
    <v-data-table-virtual
      fixed-header
      :headers="headers"
      height="400"
      hover
      :items="pieces"
      :loading="loading"
    >
      <template #item.requestedKeepData="{ value }">
        <StatusIcon
          :status="value ? 'yes': 'no'"
          :tooltip="value ? 'Yes': 'No'"
        />
      </template>
      <template #item.f05DealProposal="{ value }">
        <InfoDialog>
          <JsonViewer
            :data="value"
            title="f05 Deal Proposal"
          />
        </InfoDialog>
      </template>
      <template #item.ddoPam="{ value }">
        <InfoDialog>
          <JsonViewer
            :data="value"
            title="DDO Parameter"
          />
        </InfoDialog>
      </template>

      <template #item.pieceCID="{ item }">
        <TruncatedText :text="item.pieceCID" />
      </template>
      <template #item.rawDataSize="{ item }">
        <v-chip>{{ formatBytes(item.rawDataSize ?? 0).combined }}</v-chip>
      </template>
      <template #item.pieceSize="{ item }">
        <v-chip>{{ formatBytes(item.pieceSize).combined }}</v-chip>
      </template>
    </v-data-table-virtual>
  </UiChildCard>
</template>

<style scoped lang="scss">

</style>
