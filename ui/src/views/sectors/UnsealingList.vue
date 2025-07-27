<script setup lang="ts">
import EpochField from '@/components/app/EpochField.vue'
import { GetUnsealSectors } from '@/gql/unseal'
import { useTableSettingsStore } from "@/stores/table"
import { SectorUnsealPipeline } from '@/typed-graph'
import { IconCheck, IconClock, IconRefresh } from '@tabler/icons-vue'
import { useQuery } from '@vue/apollo-composable'
import type { MaskInputOptions } from 'maska'
import { computed, ComputedRef, onActivated, onDeactivated, reactive, ref } from 'vue'
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

const { result, loading, refetch } = useQuery(GetUnsealSectors, {
  miner: selectedMiner,
  sectorNumber: searchSectorNumber,
  offset: offset.value,
  limit: tableSettings.itemsPerPage,
}, () => ({
  fetchPolicy: 'cache-first',
  enabled: enabled.value,
  pollInterval: 10000,
}))

onActivated(() => { enabled.value = true })
onDeactivated(() => { enabled.value = false })

const items: ComputedRef<SectorUnsealPipeline[]> = computed(() => result.value?.unsealSectors || [])
const itemsCount: ComputedRef<number> = computed(() => {
  if (searchSectorNumber.value) return items.value.length
  return result.value?.unsealSectorsCount || 0
})

const headers = [
  { title: t('sectors.miner'), key: 'spID' },
  { title: t('sectors.sector'), key: 'sectorNumber' },
  { title: t('sectors.unseal.createTime'), key: 'createTime' },
  { title: t('sectors.unseal.regSealProof'), key: 'regSealProof' },
  { title: t('sectors.unseal.status.label'), key: 'status', align: 'center' },
  { title: t('sectors.unseal.unsealSdr'), key: 'afterUnsealSdr', align: 'center' },
  { title: t('sectors.unseal.decodeSector'), key: 'afterDecodeSector', align: 'center' },
] as const

const options = reactive<MaskInputOptions>({
  number: { unsigned: true, fraction: 0 },
  postProcess: value => value.replace(/,/g, '')
})

function getStatus(item: SectorUnsealPipeline): string {
  if (item.afterDecodeSector) return 'completed'
  if (item.afterUnsealSdr) return 'submitting'
  return 'encoding'
}

function getStatusColor(status: string): string {
  switch (status) {
  case 'completed': return 'success'
  case 'encoding': return 'primary'
  case 'submitting': return 'info'
  default: return 'primary'
  }
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

      <template #item.createTime="{ item }">
        <EpochField
          :epoch="Number(item.createTime)"
          format="datetime"
        />
      </template>

      <template #item.regSealProof="{ item }">
        <v-chip
          size="small"
          variant="tonal"
          color="secondary"
        >
          {{ item.regSealProof }}
        </v-chip>
      </template>

      <template #item.status="{ item }">
        <v-chip
          size="small"
          :color="getStatusColor(getStatus(item))"
          variant="tonal"
        >
          {{ t(`sectors.unseal.status.${getStatus(item)}`) }}
        </v-chip>
      </template>

      <template #item.afterUnsealSdr="{ item }">
        <v-icon
          :color="item.afterUnsealSdr ? 'success' : 'grey'"
          :icon="item.afterUnsealSdr ? IconCheck : IconClock"
          size="20"
        />
      </template>

      <template #item.afterDecodeSector="{ item }">
        <v-icon
          :color="item.afterDecodeSector ? 'success' : 'grey'"
          :icon="item.afterDecodeSector ? IconCheck : IconClock"
          size="20"
        />
      </template>
    </v-data-table>
  </v-card>
</template>

<style scoped lang="scss">

</style>
