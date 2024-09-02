<script setup lang="ts">

import { useQuery } from '@vue/apollo-composable'
import { computed, ComputedRef, ref } from 'vue'
import { Config } from '@/typed-graph'
import { GetConfigs } from '@/views/query/config'
import Edit from '@/views/configurations/EditConfiguration.vue'
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
} from '@ant-design/icons-vue'
import { Item } from 'vue3-easy-data-table'

const { result, loading, refetch, error } = useQuery(GetConfigs, null, () => ({
  fetchPolicy: 'cache-first',
}))

const items: ComputedRef<[Config]> = computed(() => result.value?.configs || [])
const headers = [
  { text: 'ID', value: 'id', sortable: true },
  { text: 'Layer', value: 'title' },
  { text: 'Used By', value: 'usedBy' },
  { text: 'Action', value: 'action' },
]

const itemsSelected = ref<Item[]>([])
const searchField = ref('title')
const searchValue = ref('')
const themeColor = ref('rgb(var(--v-theme-primary))')

const dialog = ref(false)
const editTitle = ref('')
const editConfig = ref('')
const editCreate = ref(false)

function openEditDialog (item: Config) {
  editTitle.value = item.title
  editConfig.value = item.config
  editCreate.value = false
  dialog.value = true
}

function openCreateDialog () {
  editCreate.value = true
  editConfig.value = ''
  dialog.value = true
}

function updateDialog (value: boolean) {
  if (!value) {
    editTitle.value = ''
    editConfig.value = ''
  }
  dialog.value = value
}

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
                  <SearchOutlined :style="{ fontSize: '14px' }" />
                </template>
              </v-text-field>
            </v-col>
            <v-col cols="12" md="3">
              <div class="d-flex ga-2 justify-end">
                <v-text-field
                  v-model="editTitle"
                  :error="editTitle === ''"
                  hide-details
                  persistent-placeholder
                  placeholder="Layer"
                  type="text"
                  variant="outlined"
                />
                <v-btn color="primary" :disabled="editTitle === ''" variant="flat" @click="openCreateDialog">
                  <template #prepend>
                    <PlusOutlined />
                  </template>
                  Create
                </v-btn>
                <v-btn
                  icon="true"
                  rounded
                  size="small"
                  variant="text"
                  @click="refetch"
                >
                  <ReloadOutlined class="text-lightText" :style="{ fontSize: '24px' }" />
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
            :rows-per-page="15"
            :search-field="searchField"
            :search-value="searchValue"
            table-class-name="customize-table"
            :theme-color="themeColor"
          >
            <template #empty-message>
              <p class="text-high-emphasis">{{ error?.message || 'No Data' }} </p>
            </template>
            <template #item-id="{ id }">
              <div class="player-wrapper">
                <h5 class="text-h5">#{{ id }}</h5>
              </div>
            </template>
            <template #item-usedBy="{ }">
              <div class="player-wrapper">
                <h6 class="text-subtitle-1 mb-0">1</h6>
                <small class="text-h6 text-lightText">2</small>
              </div>
            </template>
            <template #item-action="item">
              <div class="operation-wrapper">
                <v-btn
                  color="primary"
                  icon="true"
                  rounded
                  variant="text"
                  @click="openEditDialog(item)"
                >
                  <EditOutlined />
                </v-btn>
                <v-btn
                  color="error"
                  disabled
                  icon="true"
                  rounded
                  variant="text"
                >
                  <DeleteOutlined />
                </v-btn>
              </div>
            </template>
          </EasyDataTable>
        </v-card-text>
        <v-dialog
          :key="editTitle"
          v-model="dialog"
          fullscreen
          transition="dialog-bottom-transition"
        >
          <Edit :config="editConfig" :is-create="editCreate" :title="editTitle" @update-dialog="updateDialog" />
        </v-dialog>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped lang="scss">

</style>
