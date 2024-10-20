<script setup lang="ts">
import type { Header } from 'vue3-easy-data-table'
import { SectorMetaPiece } from '@/typed-graph'
import { useQuery } from '@vue/apollo-composable'
import { GetSectorPieces } from '@/views/query/sector'
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
    type: String,
    required: true,
  },
})

const { result, loading, refetch, error } = useQuery(GetSectorPieces, {
  miner: props.miner,
  sectorNumber: props.sectorNumber,
}, () => ({
  fetchPolicy: 'cache-first',
}))

const pieces: ComputedRef<[SectorMetaPiece]> = computed(() => result.value?.sector.pieces || [])

const headers :Header[] = [
  { text: 'Piece', value: 'pieceNum' },
  { text: 'StartEpoch', value: 'startEpoch' },
  { text: 'EndEpoch', value: 'origEndEpoch' },
  { text: 'Raw Data Size', value: 'rawDataSize' },
  { text: 'Piece Size', value: 'pieceSize' },
  { text: 'Piece CID', value: 'pieceCID' },
  { text: 'Keep Data', value: 'requestedKeepData' },
  { text: 'f05 DealID', value: 'f05DealID' },
  { text: 'f05 DealProposal', value: 'f05DealProposal' },
  { text: 'ddo Pam', value: 'ddoPam' },
]
</script>

<template>
  <UiChildCard :loading="loading" :title="t('fields.Pieces Info')">
    <template #action>
      <v-btn round :rounded="true" variant="text" @click="refetch">
        <IconReload />
      </v-btn>
    </template>
    <EasyDataTable
      :headers="headers"
      hide-footer
      :items="pieces"
      :loading="loading"
      :rows-per-page="100"
      table-class-name="customize-table"
      theme-color="primary"
    >
      <template #empty-message>
        <p class="text-high-emphasis">{{ error?.message || 'No Data' }} </p>
      </template>
      <template #item-f05DealProposal="{ f05DealProposal }">
        <v-btn v-if="f05DealProposal" :icon="true" :rounded="true">
          <IconInfoCircle />
          <v-dialog activator="parent">
            <v-card>
              <v-card-text>
                <pre>
                      {{ JSON.stringify(f05DealProposal, null, 2) }}
                    </pre>
              </v-card-text>
            </v-card>
          </v-dialog>
        </v-btn>
      </template>
      <template #item-ddoPam="{ ddoPam }">
        <v-btn v-if="ddoPam" :icon="true" :rounded="true">
          <IconInfoCircle />
          <v-dialog activator="parent">
            <v-card>
              <v-card-text>
                <pre>
                      {{ JSON.stringify(ddoPam, null, 2) }}
                    </pre>
              </v-card-text>
            </v-card>
          </v-dialog>
        </v-btn>
      </template>

      <template #item-pieceCID="{ pieceCID }">
        <v-text-field
          aria-label="website"
          class="pr-0"
          color="primary"
          hide-details="auto"
          max-width="250"
          min-width="200"
          :model-value="pieceCID"
          readonly
          single-line
          variant="outlined"
        />
      </template>
      <template #item-rawDataSize="{ rawDataSize }">
        <v-chip>{{ formatBytes(rawDataSize).combined }}</v-chip>
      </template>
      <template #item-pieceSize="{ pieceSize }">
        <v-chip>{{ formatBytes(pieceSize).combined }}</v-chip>
      </template>
    </EasyDataTable>
  </UiChildCard>
</template>

<style scoped lang="scss">

</style>
