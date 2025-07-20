<script setup lang="ts">
import { useQuery } from '@vue/apollo-composable'
import { computed, ComputedRef, reactive, ref, onActivated, onDeactivated } from 'vue'
import { SectorSnapPipeline } from '@/typed-graph'
import { GetSnapSectors } from '@/gql/snap'
import { IconRefresh, IconClock, IconCheck, IconX } from '@tabler/icons-vue'
import EpochField from '@/components/app/EpochField.vue'
import type { MaskInputOptions } from 'maska'
import { useTableSettingsStore } from "@/stores/table"
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const tableSettings = useTableSettingsStore()

const page = ref(1)
const offset = computed(() => (page.value - 1) * tableSettings.itemsPerPage)

const selectedMiner = ref<string>()
const searchSectorNumber = ref<number>()
const searchSectorNumberCache = ref<number>()

const enabled = ref(true)

function enterSearch (): void {
  searchSectorNumber.value = searchSectorNumberCache.value
}

const { result, loading, refetch } = useQuery(GetSnapSectors, {
  miner: selectedMiner,
  sectorNumber: searchSectorNumber,
  offset: offset.value,
  limit: tableSettings.itemsPerPage,
}, () => ({
  fetchPolicy: 'cache-first',
  enabled: enabled.value,
  pollInterval: 10000,
}))

onActivated(() => {
  enabled.value = true
})

onDeactivated(() => {
  enabled.value = false
})

const items: ComputedRef<[SectorSnapPipeline]> = computed(() => result.value?.snapSectors || [])
const itemsCount: ComputedRef<number> = computed(() => {
  if (searchSectorNumber.value) {
    return items.value.length
  }
  return result.value?.snapSectorsCount || itemsCount.value || 0
})

const headers = [
  { title: t('sectors.miner'), key: 'spID' },
  { title: t('sectors.sector'), key: 'sectorNumber' },
  { title: t('sectors.snap.startTime'), key: 'startTime' },
  { title: t('sectors.snap.upgradeProof'), key: 'upgradeProof' },
  { title: t('sectors.snap.status'), key: 'status', align: 'center' },
  { title: t('sectors.snap.encode'), key: 'afterEncode', align: 'center' },
  { title: t('sectors.snap.prove'), key: 'afterProve', align: 'center' },
  { title: t('sectors.snap.submit'), key: 'afterSubmit', align: 'center' },
  { title: t('sectors.snap.moveStorage'), key: 'afterMoveStorage', align: 'center' },
  { title: t('sectors.failed'), key: 'failed', align: 'center' },
] as const

const options = reactive<MaskInputOptions>({
  number: { unsigned: true, fraction: 0 },
  postProcess: value => {
    return value.replace(/,/g, '')
  },
})

function getStatus(item: SectorSnapPipeline): string {
  if (item.failed) return 'failed'
  if (item.afterMoveStorage) return 'completed'
  if (item.afterSubmit) return 'moveStorage'
  if (item.afterProve) return 'submitting'
  if (item.afterEncode) return 'proving'
  return 'encoding'
}

function getStatusColor(status: string): string {
  switch (status) {
  case 'completed': return 'success'
  case 'failed': return 'error'
  case 'encoding': return 'primary'
  case 'proving': return 'warning'
  case 'submitting': return 'info'
  case 'moveStorage': return 'secondary'
  default: return 'primary'
  }
}

function formatUpgradeProof(proof: number): string {
  // Map upgrade proof to human readable string
  const proofs = {
    1: '32GiB',
    2: '64GiB',
    3: '2KiB',
    4: '8MiB',
    5: '512MiB',
    6: '32GiB',
    7: '64GiB'
  } as Record<number, string>
  return proofs[proof] || `Unknown (${proof})`
}

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
          md="6"
        >
          <v-row>
            <v-col
              cols="12"
              md="3"
            >
              <v-select
                v-model="selectedMiner"
                :label="t('sectors.miner')"
                variant="outlined"
                density="compact"
                clearable
                hide-details
              />
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <v-text-field
                v-model="searchSectorNumberCache"
                v-maska:[options]="'number'"
                :label="t('sectors.sectorNumber')"
                variant="outlined"
                density="compact"
                clearable
                hide-details
                @keyup.enter="enterSearch"
              />
            </v-col>
          </v-row>
        </v-col>
        <v-col
          cols="12"
          md="6"
        >
          <div class="text-right">
            <v-btn
              :icon="IconRefresh"
              rounded
              variant="text"
              @click="refetch"
            />
          </div>
        </v-col>
      </v-row>
    </v-card-item>
    <v-divider />
    <v-data-table
      v-model:page="page"
      :headers="headers"
      :items="items"
      :items-length="itemsCount"
      :items-per-page="tableSettings.itemsPerPage"
      :loading="loading"
      class="text-no-wrap"
      item-key="spID"
    >
      <template #item.spID="{ item }">
        <code class="text-primary">{{ item.spID }}</code>
      </template>

      <template #item.sectorNumber="{ item }">
        <router-link
          :to="{ name: 'SectorDetails', params: { spId: item.spID, sectorNumber: item.sectorNumber } }"
          class="text-decoration-none"
        >
          <v-chip
            size="small"
            variant="outlined"
          >
            {{ item.sectorNumber }}
          </v-chip>
        </router-link>
      </template>

      <template #item.startTime="{ item }">
        <EpochField
          :epoch="item.startTime"
          format="datetime"
        />
      </template>

      <template #item.upgradeProof="{ item }">
        <v-chip
          size="small"
          variant="tonal"
          color="secondary"
        >
          {{ formatUpgradeProof(item.upgradeProof) }}
        </v-chip>
      </template>

      <template #item.status="{ item }">
        <v-chip
          size="small"
          :color="getStatusColor(getStatus(item))"
          variant="tonal"
        >
          {{ t(`sectors.snap.status.${getStatus(item)}`) }}
        </v-chip>
      </template>

      <template #item.afterEncode="{ item }">
        <v-icon
          :color="item.afterEncode ? 'success' : 'grey'"
          :icon="item.afterEncode ? IconCheck : IconClock"
          size="20"
        />
      </template>

      <template #item.afterProve="{ item }">
        <v-icon
          :color="item.afterProve ? 'success' : 'grey'"
          :icon="item.afterProve ? IconCheck : IconClock"
          size="20"
        />
      </template>

      <template #item.afterSubmit="{ item }">
        <v-icon
          :color="item.afterSubmit ? 'success' : 'grey'"
          :icon="item.afterSubmit ? IconCheck : IconClock"
          size="20"
        />
      </template>

      <template #item.afterMoveStorage="{ item }">
        <v-icon
          :color="item.afterMoveStorage ? 'success' : 'grey'"
          :icon="item.afterMoveStorage ? IconCheck : IconClock"
          size="20"
        />
      </template>

      <template #item.failed="{ item }">
        <v-icon
          :color="item.failed ? 'error' : 'success'"
          :icon="item.failed ? IconX : IconCheck"
          size="20"
        />
      </template>
    </v-data-table>
  </v-card>
</template>

<style scoped lang="scss">

</style>
