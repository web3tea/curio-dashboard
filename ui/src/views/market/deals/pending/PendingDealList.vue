<script setup lang="ts">

import { useMutation, useQuery } from '@vue/apollo-composable'
import { computed, ComputedRef, ref } from 'vue'
import { OpenSectorPiece } from '@/typed-graph'
import { DealSealNow, GetPendingDeals } from '@/gql/deal'
import { IconReload, IconSearch } from '@tabler/icons-vue'
import { useI18n } from 'vue-i18n'
import { formatBytes } from '@/utils/helpers/formatBytes'
import { useNotificationStore } from '@/stores/notification'

const notificationStore = useNotificationStore()
const { d } = useI18n()

const { result, loading, refetch } = useQuery(GetPendingDeals, null, () => ({
  fetchPolicy: 'cache-first',
  pollInterval: 5000,
}))
const items: ComputedRef<[OpenSectorPiece]> = computed(() => result.value?.dealsPending || [])

const { mutate: dealSealNow, loading: dealSealNowLoading, onDone, onError } = useMutation(DealSealNow, () => ({
  refetchQueries: [{
    query: GetPendingDeals,
  }],
  awaitRefetchQueries: true,
}))

onDone(() => {
  notificationStore.success('Deal sealed successfully')
})

onError(e => {
  notificationStore.error(e.message)
})

const headers = [
  { title: 'Miner', key: 'spID' },
  { title: 'Sector', key: 'sectorNumber' },
  { title: 'Piece Index', key: 'pieceIndex' },
  { title: 'Piece CID', key: 'pieceCID', sortable: false },
  { title: 'Piece Size', key: 'pieceSize' },
  { title: 'Data Raw Size', key: 'dataRawSize' },
  { title: 'Data Delete On Finalize', key: 'dataDeleteOnFinalize' },
  { title: 'Created At', key: 'createdAt' },
  { title: 'Is Snap', key: 'isSnap' },
]
const search = ref('')
const sortBy = [{ key: 'spID', order: 'asc' }, { key: 'sectorNumber', order: 'desc' }, { key: 'pieceIndex', order: 'asc' }] as const
const groupBy = [{ key: 'spID', order: 'asc' }, { key: 'sectorNumber', order: 'desc' }] as const

const fillProgress = computed(() => (spID: number, sectorNumber: number): number => {
  const totalSize = 32 * 1024 * 1024 * 1024 // 32GB in bytes
  const filledSize = items.value
    .filter(item => item.spID === spID && item.sectorNumber === sectorNumber)
    .reduce((acc, item) => acc + item.pieceSize, 0)
  return (filledSize / totalSize) * 100
})

</script>

<template>
  <v-card
    class="bg-surface"
    elevation="0"
    variant="outlined"
  >
    <v-card-item>
      <v-row
        class="align-center"
        justify="space-between"
      >
        <v-col
          cols="12"
          md="3"
        >
          <v-text-field
            v-model="search"
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
        <v-col
          cols="12"
          md="3"
        >
          <div class="d-flex ga-2 justify-end">
            <v-btn
              :icon="IconReload"
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
        fixed-header
        :group-by="groupBy"
        :headers="headers"
        height="780"
        hover
        :items="items"
        :loading="loading"
        multi-sort
        :search="search"
        :sort-by="sortBy"
        sticky
      >
        <template #item.createdAt="{ item }">
          {{ d(item.createdAt, 'short') }}
        </template>
        <template #group-header="{ item, index, columns, toggleGroup, isGroupOpen }">
          <div
            :ref="(el)=>{
              if (index ===0 && !loading && !isGroupOpen(item))
                toggleGroup(item);
            }"
          />
          <tr>
            <td
              :class="'pl-'+index+1"
              :colspan="3"
            >
              <v-btn
                :icon="isGroupOpen(item) ? '$expand' : '$next'"
                size="small"
                variant="text"
                @click="toggleGroup(item)"
              />
              {{ index ===1 ? 'Sector : ' + item.value: item.value }} ({{ item.items.reduce((acc, curr) => acc + (curr.items ? curr.items.length : 1), 0) }})
            </td>
            <td
              v-if="index === 1"
              :colspan="1"
            >
              <v-btn
                color="primary"
                :loading="dealSealNowLoading"
                @click="dealSealNow(
                  { miner: item.items[0].columns.spID, sector: item.items[0].columns.sectorNumber }
                )"
              >
                Seal Now
              </v-btn>
            </td>
            <td
              v-if="index===1"
              :colspan="columns.length-4"
            >
              <v-progress-linear
                color="success"
                height="25"
                :model-value="fillProgress(item.items[0].columns.spID, item.items[0].columns.sectorNumber)"
              >
                <strong>{{ fillProgress(item.items[0].columns.spID, item.items[0].columns.sectorNumber).toFixed(2) }}%</strong>
              </v-progress-linear>
            </td>
          </tr>
        </template>
        <template #item.pieceSize="{ value }">
          {{ formatBytes(value, 2).combined }}
        </template>
        <template #item.dataRawSize="{ value }">
          {{ formatBytes(value, 2).combined }}
        </template>
        <template #item.pieceCID="{ value }">
          <TruncatedChip :text="value" />
        </template>
      </v-data-table-virtual>
    </v-card-text>
  </v-card>
</template>
