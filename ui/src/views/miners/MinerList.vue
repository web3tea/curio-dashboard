<script setup lang="ts">

import { IconReload, IconSearch } from '@tabler/icons-vue'
import { useQuery } from '@vue/apollo-composable'
import { computed, ComputedRef, ref } from 'vue'
import { Actor } from '@/typed-graph'
import { GetActors } from '@/gql/miner'
import { formatFIL } from '@/utils/helpers/formatFIL'
import { formatBytes } from '@/utils/helpers/formatBytes'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const { result, loading, refetch } = useQuery(GetActors, null, () => ({
  fetchPolicy: 'cache-first',
}))
const items: ComputedRef<[Actor]> = computed(() => result.value?.actors || [])

const searchValue = ref('')

const headers = [
  { title: 'Address', key: 'address' },
  { title: 'Layers', key: 'layers' },
  { title: 'Balance', key: 'actorBalance' },
  { title: 'Available Balance', key: 'actorAvailableBalance' },
  { title: 'Worker Balance', key: 'workerBalance' },
  { title: 'QA Power', key: 'qualityAdjustedPower' },
  { title: 'RAW Power', key: 'rawBytePower' },
]

</script>

<template>
  <v-row>
    <v-col
      cols="12"
      md="12"
    >
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
                v-model="searchValue"
                hide-details
                persistent-placeholder
                :placeholder="t('fields.Search')"
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
            :headers="headers"
            hover
            :items="items"
            :loading="loading"
            :search="searchValue"
          >
            <template #item.address="{ item }">
              <RouterLink :to="{ name: 'MinerDetails', params: { id: item.address } }">
                {{ item.address }}
              </RouterLink>
            </template>
            <template #item.actorBalance="{ item }">
              {{ formatFIL(item.actorBalance) }}
            </template>
            <template #item.layers="{ item }">
              <v-chip-group>
                <v-chip
                  v-for="layer in item.layers"
                  :key="layer"
                >
                  <RouterLink :to="{ name: 'ConfigurationEdit', params: { layer: layer } }">
                    {{ layer }}
                  </RouterLink>
                </v-chip>
              </v-chip-group>
            </template>
            <template #item.actorAvailableBalance="{ item }">
              {{ formatFIL(item.actorAvailableBalance) }}
            </template>
            <template #item.workerBalance="{ item }">
              {{ formatFIL(item.workerBalance) }}
            </template>
            <template #item.qualityAdjustedPower="{ item }">
              {{ formatBytes(item.qualityAdjustedPower).combined }}
            </template>
            <template #item.rawBytePower="{ item }">
              {{ formatBytes(item.rawBytePower).combined }}
            </template>
          </v-data-table-virtual>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped lang="scss">

</style>
