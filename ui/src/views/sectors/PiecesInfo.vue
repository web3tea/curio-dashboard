<script setup lang="ts">
import { SectorMetaPiece } from '@/typed-graph'
import { useQuery } from '@vue/apollo-composable'
import { GetSectorPieces } from '@/gql/sector'
import { computed, ComputedRef } from 'vue'
import UiChildCard from '@/components/shared/UiChildCard.vue'
import { formatBytes } from '@/utils/helpers/formatBytes'
import { IconInfoCircle, IconReload } from '@tabler/icons-vue'
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
  { title: 'Keep Data', key: 'requestedKeepData' },
  { title: 'f05 DealID', key: 'f05DealID' },
  { title: 'f05 DealProposal', key: 'f05DealProposal' },
  { title: 'ddo Pam', key: 'ddoPam' },
]

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
      <template #item.f05DealProposal="{ value }">
        <v-icon>
          <IconInfoCircle size="18" />
          <v-dialog activator="parent">
            <JsonViewer
              :data="value"
              title="f05 Deal Proposal"
            />
          </v-dialog>
        </v-icon>
      </template>
      <template #item.ddoPam="{ value }">
        <v-btn
          v-if="value"
          :icon="true"
          :rounded="true"
        >
          <IconInfoCircle size="18" />
          <v-dialog activator="parent">
            <JsonViewer
              :data="value"
              title="DDO Parameter"
            />
          </v-dialog>
        </v-btn>
      </template>

      <template #item.pieceCID="{ item }">
        <v-text-field
          aria-label="website"
          class="pr-0"
          color="primary"
          hide-details="auto"
          max-width="250"
          min-width="200"
          :model-value="item.pieceCID"
          readonly
          single-line
          variant="outlined"
        />
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
