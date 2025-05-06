<script setup lang="ts">
import { useQuery } from '@vue/apollo-composable'
import { GetStoragePaths } from '@/gql/storage'
import { computed, ComputedRef, ref } from 'vue'
import { StoragePath, Storage } from '@/typed-graph'
import { IconRefresh, IconSearch } from '@tabler/icons-vue'
import { formatBytes } from '@/utils/helpers/formatBytes'
import { getRelativeTime } from '@/utils/helpers/time'
import { getColorByType } from '@/utils/helpers/storageTypeColor'

const { result, loading, refetch, error } = useQuery(GetStoragePaths, null, {})

const items: ComputedRef<StoragePath[]> = computed(() => {
  if (!result.value?.storages) return []
  return result.value.storages.map((storage: Storage) => storage.path)
})

const headers = [
  { title: 'ID', key: 'storageId', sortable: true },
  { title: 'Status', key: 'status', align: 'center', sortable: true },
  { title: 'Capacity', key: 'capacity', align: 'end', sortable: true },
  { title: 'Used', key: 'used', align: 'end', sortable: true },
  { title: 'Available', key: 'available', align: 'end', sortable: true },
  { title: 'Usage', key: 'usagePercentage', align: 'center', sortable: true },
  { title: 'Type', key: 'type', align: 'center', sortable: false },
  { title: 'Last Heartbeat', key: 'lastHeartbeat', align: 'center', sortable: true },
  { title: 'Actions', key: 'actions', align: 'center', sortable: false }
] as const

const searchValue = ref('')

const isHeartbeatStale = (dateStr: string): boolean => {
  if (!dateStr) return true
  const date = new Date(dateStr)
  const now = new Date()
  return (now.getTime() - date.getTime()) > 600000
}

const getUsagePercentage = (capacity: number, available: number): number => {
  if (!capacity || capacity === 0 || !available) return 0
  return Math.round(((capacity - available) / capacity) * 100)
}

const getUsageColor = (percentage: number): string => {
  if (!percentage) return 'success'
  if (percentage > 90) return 'error'
  if (percentage > 70) return 'warning'
  return 'success'
}

const isStorageHealthy = (path: StoragePath): boolean => {
  if (!path.lastHeartbeat) return false
  return !isHeartbeatStale(path.lastHeartbeat) && !path.heartbeatErr
}

const getStorageType = (path: StoragePath): string => {
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
              md="6"
            >
              <h2>Storage Paths</h2>
            </v-col>
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
            :items="items"
            :search="searchValue"
            :loading="loading"
            :items-per-page="10"
            class="elevation-0"
          >
            <template #item.storageId="{ value }">
              {{ value }}
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

            <template #item.actions>
              <div class="d-flex justify-center">
                <v-btn
                  icon
                  size="small"
                  color="grey"
                  variant="text"
                  disabled
                >
                  <v-icon :size="18">
                    mdi-dots-horizontal
                  </v-icon>
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
</template>

<style scoped lang="scss">
</style>
