<script setup lang="ts">

import { useQuery } from '@vue/apollo-composable'
import { computed, ComputedRef, ref } from 'vue'
import { Config } from '@/typed-graph'
import { GetConfigs } from '@/views/query/config'
import { Item } from 'vue3-easy-data-table'
import { IconPlus, IconReload, IconSearch } from '@tabler/icons-vue'
import ConfigRemoveDialog from '@/views/configurations/ConfigRemoveDialog.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const { result, loading, refetch, error } = useQuery(GetConfigs, null, () => ({
  fetchPolicy: 'cache-first',
}))

const items: ComputedRef<[Config]> = computed(() => result.value?.configs || [])
const headers = [
  { text: 'ID', value: 'id', sortable: true },
  { text: 'Layer', value: 'title' },
  { text: 'Used By', value: 'usedBy' },
  { text: '    ', value: 'action' },
]

const itemsSelected = ref<Item[]>([])
const searchField = ref('title')
const searchValue = ref('')
const themeColor = ref('rgb(var(--v-theme-primary))')

</script>

<template>
  <v-row>
    <v-col cols="12" md="12">
      <v-card class="bg-surface" elevation="0" variant="outlined">
        <v-card-item>
          <v-row class="align-center" justify="space-between">
            <v-col cols="12" md="3">
              <v-text-field
                v-model="searchValue"
                hide-details
                persistent-placeholder
                placeholder="Search"
                type="text"
                variant="outlined"
              >
                <template #prepend-inner>
                  <IconSearch :size="16" />
                </template>
              </v-text-field>
            </v-col>
            <v-col cols="12" md="3">
              <div class="d-flex ga-2 justify-end">
                <v-btn color="primary" :to="{name: 'ConfigurationCreate'}" variant="flat">
                  <template #prepend>
                    <IconPlus />
                  </template>
                  {{ t('fields.Create') }}
                </v-btn>
                <v-btn
                  icon="true"
                  rounded
                  size="small"
                  variant="text"
                  @click="refetch"
                >
                  <IconReload />
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-card-item>
        <v-divider />
        <v-card-text class="pa-0">
          <EasyDataTable
            v-model:items-selected="itemsSelected"
            :headers="headers"
            :items="items"
            :loading="loading"
            :rows-per-page="100"
            :search-field="searchField"
            :search-value="searchValue"
            table-class-name="customize-table"
            :theme-color="themeColor"
          >
            <template #empty-message>
              <p class="text-high-emphasis">{{ error?.message || 'No Data' }} </p>
            </template>
            <template #item-id="{ id, title }">
              <RouterLink :to="{ name: 'ConfigurationEdit', params: { layer: title } }">{{ id }}</RouterLink>
            </template>
            <template #item-usedBy="{ usedBy }">
              <v-chip-group column>
                <v-chip v-for="by in usedBy" :key="by.machineId" :to="{name: 'MachineInfo', params: {id: by.machineId}}">{{ by.machineName || by.machineId }}</v-chip>
              </v-chip-group>
            </template>
            <template #item-action="{ id, title, usedBy }">
              <ConfigRemoveDialog v-if="usedBy.length === 0 && id > 100" :title="title" />
            </template>
          </EasyDataTable>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped lang="scss">

</style>
