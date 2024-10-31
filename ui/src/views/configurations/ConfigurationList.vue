<script setup lang="ts">

import { useQuery } from '@vue/apollo-composable'
import { computed, ComputedRef, ref } from 'vue'
import { Config } from '@/typed-graph'
import { GetConfigs } from '@/views/query/config'
import { IconPlus, IconReload, IconSearch } from '@tabler/icons-vue'
import ConfigRemoveDialog from '@/views/configurations/ConfigRemoveDialog.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const { result, loading, refetch } = useQuery(GetConfigs, null, () => ({
  fetchPolicy: 'cache-first',
}))

const items: ComputedRef<[Config]> = computed(() => result.value?.configs || [])
const headers = [
  { title: 'ID', key: 'id' },
  { title: 'Layer', key: 'title' },
  { title: 'Used By', key: 'usedBy' },
  { title: '    ', key: 'action' },
]

const searchValue = ref('')

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
                  <IconSearch :size="14" />
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
            <template #item.id="{ item }">
              <RouterLink :to="{ name: 'ConfigurationEdit', params: { layer: item.title } }">{{ item.id }}</RouterLink>
            </template>
            <template #item.title="{ value }">
              <RouterLink :to="{ name: 'ConfigurationEdit', params: { layer: value } }">{{ value }}</RouterLink>
            </template>
            <template #item.usedBy="{ item }">
              <v-chip-group column>
                <v-chip v-for="(by, index) in item.usedBy" :key="index" :to="{name: 'MachineInfo', params: {id: by?.machineId}}">{{ by?.machineName || by?.machineId }}</v-chip>
              </v-chip-group>
            </template>
            <template #item.action="{ item }">
              <ConfigRemoveDialog v-if="item.usedBy.length === 0 && item.id > 100" :title="item.title" />
            </template>
          </v-data-table-virtual>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped lang="scss">

</style>
