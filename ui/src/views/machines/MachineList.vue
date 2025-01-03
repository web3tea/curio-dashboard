<script setup lang="ts">
import { computed, ComputedRef, ref } from 'vue'
import { EyeOutlined, SearchOutlined } from '@ant-design/icons-vue'
import { IconReload } from '@tabler/icons-vue'
import { useQuery } from '@vue/apollo-composable'
import { GetMachines } from '@/gql/machine'
import { Machine } from '@/typed-graph'
import { formatBytes } from '@/utils/helpers/formatBytes'

const { result, loading, refetch } = useQuery(GetMachines, null, () => ({
  fetchPolicy: 'cache-first',
}))
const items: ComputedRef<[Machine]> = computed(() => result.value?.machines || [])

const allLayers = computed(() => {
  const layers = new Set<string>()
  items.value.forEach(item => {
    item.detail?.layers.split(',').forEach(layer => {
      layers.add(layer)
    })
  })
  return Array.from(layers)
})

const allSupportTasks = computed(() => {
  const tasks = new Set<string>()
  items.value.forEach(item => {
    item.detail?.tasks.split(',').forEach(task => {
      tasks.add(task)
    })
  })
  return Array.from(tasks)
})
const searchValue = ref('')
const selectLayer = ref(null)
const selectSupportTask = ref(null)

const filterItems = computed(() => {
  return items.value.filter(item => {
    if (selectLayer.value && !item.detail?.layers.includes(selectLayer.value)) {
      return false
    }
    return !(selectSupportTask.value && !item.detail?.tasks.includes(selectSupportTask.value))
  })
})

const headers = [
  { title: 'ID', value: 'id' },
  { title: 'Name', value: 'detail.machineName' },
  { title: 'Host', value: 'hostAndPort' },
  { title: 'Last Contact', value: 'lastContact', sortable: true },
  { title: 'Startup', value: 'detail.startupTime', sortable: true },
  { title: 'CPU', value: 'cpu', sortable: true },
  { title: 'GPU', value: 'gpu', sortable: true },
  { title: 'RAM', value: 'ram', sortable: true },
  { title: 'Layers', value: 'detail.layers' },
  { title: 'Support Tasks', value: 'detail.tasks' },
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
                placeholder="Search"
                type="text"
                variant="outlined"
              >
                <template #prepend-inner>
                  <SearchOutlined :style="{ fontSize: '14px' }" />
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
            :items="filterItems"
            :loading="loading"
            :search="searchValue"
          >
            <template #header.detail.layers="{column}">
              <v-autocomplete
                v-model="selectLayer"
                aria-label="autocomplete"
                class="remove-details"
                clear-icon="$close"
                clearable
                color="primary"
                :items="allLayers"
                :label="column?.title?.toUpperCase()"
                variant="outlined"
              />
            </template>
            <template #header.detail.tasks="{column}">
              <v-autocomplete
                v-model="selectSupportTask"
                aria-label="autocomplete"
                class="remove-details"
                clear-icon="$close"
                clearable
                color="primary"
                :items="allSupportTasks"
                :label="column?.title?.toUpperCase()"
                variant="outlined"
              />
            </template>
            <template #item.id="{ value }">
              <RouterLink :to="{ name: 'MachineInfo', params: { id: Number(value) } }">
                {{ value }}
              </RouterLink>
            </template>
            <template #item.hostAndPort="{ item }">
              <RouterLink :to="{ name: 'MachineInfo', params: { id: item.id } }">
                {{ item.hostAndPort }}
              </RouterLink>
            </template>
            <template #item.lastContact="{ value }">
              <div :title="value">
                {{ $d(value, 'short') }}
              </div>
            </template>
            <template #item.detail.startupTime="{ value }">
              <div :title="value">
                {{ $d(value, 'short') }}
              </div>
            </template>
            <template #item.ram="{ value }">
              <div>{{ formatBytes(value).combined }}</div>
            </template>
            <template #item.detail.layers="{ value }">
              <v-chip-group column>
                <v-chip
                  v-for="layer in value.split(',')"
                  :key="layer"
                  :to="{name: 'ConfigurationEdit', params: {layer: layer}}"
                >
                  {{ layer }}
                </v-chip>
              </v-chip-group>
            </template>
            <template #item.detail.tasks="{ value }">
              <v-chip-group column>
                <v-chip
                  v-for="task in value.split(',')"
                  :key="task"
                >
                  {{ task }}
                </v-chip>
              </v-chip-group>
            </template>
            <template #item.operation="{}">
              <div class="operation-wrapper">
                <v-btn
                  color="secondary"
                  rounded
                  title="More"
                  variant="text"
                >
                  <EyeOutlined />
                </v-btn>
              </div>
            </template>
          </v-data-table-virtual>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
