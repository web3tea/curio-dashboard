<script setup lang="ts">
import { useQuery } from '@vue/apollo-composable'
import { GetStoragePaths } from '@/gql/storage'
import { computed, ComputedRef, ref } from 'vue'
import { StoragePath, Storage, StorageType } from '@/typed-graph'
import { IconRefresh, IconSearch, IconEye } from '@tabler/icons-vue'
import { formatBytes } from '@/utils/helpers/formatBytes'
import { getRelativeTime } from '@/utils/helpers/time'
import { getColorByType } from '@/utils/helpers/storageTypeColor'
import TableFilterMenu from '@/components/app/TableFilterMenu.vue'
import { useI18n } from 'vue-i18n'
import StoragePathDetailDialog from './StoragePathDetailDialog.vue'

const { t } = useI18n()

const { result, loading, refetch, error } = useQuery(GetStoragePaths, null, {})

const items: ComputedRef<StoragePath[]> = computed(() => {
  if (!result.value?.storages) return []
  return result.value.storages.map((storage: Storage) => storage.path)
})

const headers = [
  { title: 'ID', key: 'storageId', sortable: true },
  { title: 'Status', key: 'status', align: 'center', sortable: false },
  { title: 'Capacity', key: 'capacity', align: 'end', sortable: true },
  { title: 'Used', key: 'used', align: 'end', sortable: true },
  { title: 'Available', key: 'available', align: 'end', sortable: true },
  { title: 'Usage', key: 'usagePercentage', align: 'center', sortable: true },
  { title: 'Type', key: 'type', align: 'center', sortable: false },
  { title: 'Last Heartbeat', key: 'lastHeartbeat', align: 'center', sortable: true },
  { title: 'Actions', key: 'actions', align: 'center', sortable: false }
] as const

const searchValue = ref('')
const showDetailDialog = ref(false)
const selectedStorageId = ref<string | null>(null)

// Filter state
const statusMenuOpen = ref(false)
const typeMenuOpen = ref(false)
const statusFilterSearch = ref('')
const typeFilterSearch = ref('')
const selectedStatuses = ref<string[]>([])
const selectedTypes = ref<string[]>([])

// Possible status and type values
const allStatuses = ['Healthy', 'Unhealthy']
const allStorageTypes: StorageType[] = ['Hybrid', 'Seal', 'Store', 'Readonly']

// Computed properties for filtered options
const filteredStatusOptions = computed(() => {
  if (!statusFilterSearch.value) return allStatuses
  const searchLower = statusFilterSearch.value.toLowerCase()
  return allStatuses.filter(status => status.toLowerCase().includes(searchLower))
})

const filteredTypeOptions = computed(() => {
  if (!typeFilterSearch.value) return allStorageTypes
  const searchLower = typeFilterSearch.value.toLowerCase()
  return allStorageTypes.filter(type => type.toLowerCase().includes(searchLower))
})

// Methods for clearing filters
const clearStatusFilters = () => {
  selectedStatuses.value = []
  statusFilterSearch.value = ''
}

const clearTypeFilters = () => {
  selectedTypes.value = []
  typeFilterSearch.value = ''
}

// Filtered items with filter logic
const filteredItems = computed(() => {
  if (selectedStatuses.value.length === 0 && selectedTypes.value.length === 0) {
    return items.value // Return all items when no filters are applied
  }

  return items.value.filter(item => {
    // Filter by status if any status is selected
    if (selectedStatuses.value.length > 0) {
      const itemStatus = isStorageHealthy(item) ? 'Healthy' : 'Unhealthy'
      if (!selectedStatuses.value.includes(itemStatus)) {
        return false
      }
    }

    // Filter by type if any type is selected
    if (selectedTypes.value.length > 0 && !selectedTypes.value.includes(getStorageType(item))) {
      return false
    }

    return true
  })
})

const isHeartbeatStale = (dateStr: string): boolean => {
  if (!dateStr) return true
  const date = new Date(dateStr)
  const now = new Date()
  return (now.getTime() - date.getTime()) > 600000
}

const getUsagePercentage = (capacity: number, available: number): number => {
  if (capacity === 0) return 0
  return Math.round(((capacity - available) / capacity) * 100)
}

const getUsageColor = (percentage: number): string => {
  if (percentage > 90) return 'error'
  if (percentage > 70) return 'warning'
  return 'success'
}

const isStorageHealthy = (path: StoragePath): boolean => {
  if (!path.lastHeartbeat) return false
  return !isHeartbeatStale(path.lastHeartbeat) && !path.heartbeatErr
}

const getStorageType = (path: StoragePath): StorageType => {
  if (path.canSeal && path.canStore) return 'Hybrid'
  if (path.canSeal) return 'Seal'
  if (path.canStore) return 'Store'
  return 'Readonly'
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
                  :loading="loading"
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
        <v-card-text class="pa-0">
          <v-data-table-virtual
            :headers="headers"
            :items="filteredItems"
            :search="searchValue"
            :loading="loading"
            :items-per-page="10"
            class="elevation-0"
          >
            <template #item.storageId="{ value }">
              <a
                href="#"
                @click.prevent="selectedStorageId = value; showDetailDialog = true"
              >
                {{ value }}
              </a>
            </template>
            <template #header.status="{column}">
              <TableFilterMenu
                :column-title="column.title || ''"
                :menu-open="statusMenuOpen"
                :selected-items="selectedStatuses"
                :filter-title="t('storageFilter.filterStatus', 'Filter Status')"
                :options="filteredStatusOptions"
                :search-value="statusFilterSearch"
                @update:menu-open="statusMenuOpen = $event"
                @update:search-value="statusFilterSearch = $event"
                @update:selected-items="selectedStatuses = $event"
                @clear="clearStatusFilters"
              />
            </template>

            <template #item.status="{ item }">
              <v-chip
                :color="isStorageHealthy(item) ? 'success' : 'error'"
                size="small"
                label
              >
                {{ isStorageHealthy(item) ? 'Healthy' : 'Unhealthy' }}
              </v-chip>
            </template>

            <template #item.capacity="{ item }">
              {{ formatBytes(item.capacity).combined }}
            </template>

            <template #item.used="{ item }">
              {{ formatBytes(item.used).combined }}
            </template>

            <template #item.available="{ item }">
              {{ formatBytes(item.available).combined }}
            </template>

            <template #item.usagePercentage="{ item }">
              <v-progress-linear
                :model-value="getUsagePercentage(item.capacity, item.available)"
                height="10"
                rounded
                :color="getUsageColor(getUsagePercentage(item.capacity, item.available))"
              />
              <span class="text-caption">{{ getUsagePercentage(item.capacity, item.available) }}%</span>
            </template>

            <template #header.type="{column}">
              <TableFilterMenu
                :column-title="column.title || ''"
                :menu-open="typeMenuOpen"
                :selected-items="selectedTypes"
                :filter-title="t('storageFilter.filterType', 'Filter Type')"
                :options="filteredTypeOptions"
                :search-value="typeFilterSearch"
                @update:menu-open="typeMenuOpen = $event"
                @update:search-value="typeFilterSearch = $event"
                @update:selected-items="selectedTypes = $event"
                @clear="clearTypeFilters"
              />
            </template>

            <template #item.type="{ item }">
              <v-chip
                size="small"
                :color="getColorByType(getStorageType(item))"
                label
              >
                {{ getStorageType(item) }}
              </v-chip>
            </template>

            <template #item.lastHeartbeat="{ item }">
              <span :class="{'text-error': isHeartbeatStale(item.lastHeartbeat)}">
                {{ getRelativeTime(item.lastHeartbeat) }}
              </span>
            </template>

            <template #item.actions="{ item }">
              <div class="d-flex justify-center">
                <v-btn
                  icon
                  size="small"
                  color="primary"
                  variant="text"
                  @click="selectedStorageId = item.storageId; showDetailDialog = true"
                >
                  <IconEye :size="18" />
                </v-btn>
              </div>
            </template>

            <template #no-data>
              <p
                v-if="error"
                class="text-center py-4 text-error"
              >
                Error loading data: {{ error.message }}
              </p>
              <p
                v-else
                class="text-center py-4"
              >
                No storage paths found
              </p>
            </template>
          </v-data-table-virtual>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>

  <!-- Storage Detail Dialog -->
  <StoragePathDetailDialog
    v-model="showDetailDialog"
    :storage-id="selectedStorageId || ''"
  />
</template>

<style scoped lang="scss">
</style>
