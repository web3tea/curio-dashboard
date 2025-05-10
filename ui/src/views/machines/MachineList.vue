<script setup lang="ts">
import { computed, ComputedRef, ref, reactive } from 'vue'
import { IconRefresh, IconEye, IconSearch } from '@tabler/icons-vue'
import TableFilterMenu from '@/components/app/TableFilterMenu.vue'
import { useQuery } from '@vue/apollo-composable'
import { GetMachines } from '@/gql/machine'
import { Machine } from '@/typed-graph'
import { formatBytes } from '@/utils/helpers/formatBytes'
import { useI18n } from 'vue-i18n'
import { getRelativeTime } from '@/utils/helpers/time'

const { t } = useI18n()

const { result, loading, refetch } = useQuery(GetMachines, null, () => ({
  fetchPolicy: 'cache-first',
}))
const items: ComputedRef<[Machine]> = computed(() => result.value?.machines || [])

const allLayers = computed(() => {
  const layers = new Set<string>()
  items.value.forEach(item => {
    if (item.detail?.layers) {
      item.detail.layers.split(',').forEach((layer: string) => {
        if (layer.trim()) {
          layers.add(layer.trim())
        }
      })
    }
  })
  return Array.from(layers).sort()
})

const allSupportTasks = computed(() => {
  const tasks = new Set<string>()
  items.value.forEach(item => {
    if (item.detail?.tasks) {
      item.detail.tasks.split(',').forEach((task: string) => {
        if (task.trim()) {
          tasks.add(task.trim())
        }
      })
    }
  })
  return Array.from(tasks).sort()
})

// Menu visibility states
const layersMenuOpen = ref(false)
const tasksMenuOpen = ref(false)

const searchValue = ref('')
const layerFilterSearch = ref('')
const taskFilterSearch = ref('')
const selectedLayers = ref<string[]>([])
const selectedTasks = ref<string[]>([])

// Computed properties for filtered options
const filteredLayerOptions = computed(() => {
  if (!layerFilterSearch.value) return allLayers.value
  return allLayers.value.filter(layer =>
    layer.toLowerCase().includes(layerFilterSearch.value.toLowerCase())
  )
})

const filteredTaskOptions = computed(() => {
  if (!taskFilterSearch.value) return allSupportTasks.value
  return allSupportTasks.value.filter(task =>
    task.toLowerCase().includes(taskFilterSearch.value.toLowerCase())
  )
})

// Update headers to use reactive properties for menu state
const headers = reactive([
  { title: 'ID', value: 'id' },
  { title: 'Name', value: 'detail.machineName' },
  { title: 'Host', value: 'hostAndPort' },
  { title: 'Last Contact', value: 'lastContact', sortable: true },
  { title: 'Startup', value: 'detail.startupTime', sortable: true },
  { title: 'CPU', value: 'cpu', sortable: true },
  { title: 'GPU', value: 'gpu', sortable: true },
  { title: 'RAM', value: 'ram', sortable: true },
  { title: 'Layers', value: 'detail.layers', maxWidth: 150 },
  { title: 'Support Tasks', value: 'detail.tasks', maxWidth: 500 },
])

const filterItems = computed(() => {
  return items.value.filter(item => {
    // If no layer filters are selected, show all items
    if (selectedLayers.value.length > 0) {
      if (!item.detail?.layers) return false

      // Check if any of the machine's layers are in the selected layers
      const machineLayers = item.detail.layers.split(',').map((layer: string) => layer.trim())
      const hasSelectedLayer = machineLayers.some((layer: string) =>
        selectedLayers.value.includes(layer)
      )

      if (!hasSelectedLayer) return false
    }

    // If no task filters are selected, show all items
    if (selectedTasks.value.length > 0) {
      if (!item.detail?.tasks) return false

      // Check if any of the machine's tasks are in the selected tasks
      const machineTasks = item.detail.tasks.split(',').map((task: string) => task.trim())
      const hasSelectedTask = machineTasks.some((task: string) =>
        selectedTasks.value.includes(task)
      )

      if (!hasSelectedTask) return false
    }

    return true
  })
})

// Methods
const clearLayerFilters = () => {
  selectedLayers.value = []
  layerFilterSearch.value = ''
}

const clearTaskFilters = () => {
  selectedTasks.value = []
  taskFilterSearch.value = ''
}
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
                :placeholder="t('machine.search')"
                type="text"
                variant="outlined"
                :prepend-inner-icon="IconSearch"
              />
            </v-col>
            <v-col
              cols="12"
              md="3"
            >
              <div class="d-flex ga-2 justify-end">
                <v-btn
                  :icon="IconRefresh"
                  rounded
                  variant="text"
                  size="small"
                  :loading="loading"
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
              <TableFilterMenu
                :column-title="column.title || ''"
                :menu-open="layersMenuOpen"
                :selected-items="selectedLayers"
                :filter-title="t('machine.filterLayers')"
                :options="filteredLayerOptions"
                :search-value="layerFilterSearch"
                @update:menu-open="layersMenuOpen = $event"
                @update:search-value="layerFilterSearch = $event"
                @update:selected-items="selectedLayers = $event"
                @clear="clearLayerFilters"
              />
            </template>

            <template #header.detail.tasks="{column}">
              <TableFilterMenu
                :column-title="column.title || ''"
                :menu-open="tasksMenuOpen"
                :selected-items="selectedTasks"
                :filter-title="t('machine.filterTasks')"
                :options="filteredTaskOptions"
                :search-value="taskFilterSearch"
                @update:menu-open="tasksMenuOpen = $event"
                @update:search-value="taskFilterSearch = $event"
                @update:selected-items="selectedTasks = $event"
                @clear="clearTaskFilters"
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
                {{ getRelativeTime(value) }}
              </div>
            </template>
            <template #item.detail.startupTime="{ value }">
              <div :title="value">
                {{ getRelativeTime(value, 'short') }}
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
                  size="small"
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
                  size="small"
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
                  <IconEye
                    :size="16"
                    stroke-width="2"
                  />
                </v-btn>
              </div>
            </template>
          </v-data-table-virtual>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped>
</style>
