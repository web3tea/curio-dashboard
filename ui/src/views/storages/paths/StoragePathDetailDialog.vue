<script setup lang="ts">
import { useQuery } from '@vue/apollo-composable'
import { GetStorage } from '@/gql/storage'
import { computed, ComputedRef, watch } from 'vue'
import { StoragePath, StorageLiveness, StorageType } from '@/typed-graph'
import { formatBytes } from '@/utils/helpers/formatBytes'
import { getRelativeTime } from '@/utils/helpers/time'
import { getColorByType } from '@/utils/helpers/storageTypeColor'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  storageId: {
    type: String,
    required: true
  },
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const { t } = useI18n()

// Query storage path data
const { result, loading, error, refetch } = useQuery(
  GetStorage,
  () => ({ id: props.storageId }),
  { fetchPolicy: 'cache-and-network', enabled: computed(() => !!props.modelValue) }
)

const storagePath: ComputedRef<StoragePath | null> = computed(() => {
  if (!result.value?.storage?.path) return null
  return result.value.storage.path
})

const storageLiveness: ComputedRef<StorageLiveness | null> = computed(() => {
  if (!result.value?.storage?.liveness) return null
  return result.value.storage.liveness
})

// Helper functions
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
  if (percentage > 90) return 'error'
  if (percentage > 70) return 'warning'
  return 'success'
}

const isStorageHealthy = (path: StoragePath | null): boolean => {
  if (!path || !path.lastHeartbeat) return false
  return !isHeartbeatStale(path.lastHeartbeat) && !path.heartbeatErr
}

const getStorageType = (path: StoragePath | null): StorageType => {
  if (!path) return 'Readonly'
  if (path.canSeal && path.canStore) return 'Hybrid'
  if (path.canSeal) return 'Seal'
  if (path.canStore) return 'Store'
  return 'Readonly'
}

// Handle dialog state
const dialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Refresh data when dialog opens
watch(() => dialog.value, (newVal) => {
  if (newVal && props.storageId) {
    refetch()
  }
})
</script>

<template>
  <v-dialog
    v-model="dialog"
    max-width="800px"
    scrollable
  >
    <v-card>
      <v-card-title class="d-flex align-center justify-space-between">
        <span>{{ t('storage.details') }}</span>
        <v-btn
          icon
          variant="text"
          color="default"
          :loading="loading"
          @click="refetch"
        >
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider />

      <!-- Loading and error states -->
      <v-card-text
        v-if="loading && !storagePath"
        class="d-flex justify-center pa-4"
      >
        <v-progress-circular indeterminate />
      </v-card-text>

      <v-card-text
        v-else-if="error"
        class="text-error"
      >
        {{ error.message }}
      </v-card-text>

      <v-card-text
        v-else-if="!storagePath"
        class="text-center"
      >
        {{ t('storage.noStorageFound') }}
      </v-card-text>

      <!-- Storage data -->
      <template v-else>
        <!-- Status overview -->
        <v-card-text>
          <v-row>
            <v-col
              cols="12"
              md="6"
            >
              <div class="d-flex flex-column gap-3">
                <div>
                  <div class="text-caption text-secondary mb-1">
                    ID
                  </div>
                  <div class="text-subtitle-1">
                    {{ storagePath.storageId }}
                  </div>
                </div>

                <div>
                  <div class="text-caption text-secondary mb-1">
                    {{ t('storage.status') }}
                  </div>
                  <v-chip
                    :color="isStorageHealthy(storagePath) ? 'success' : 'error'"
                    size="small"
                    label
                  >
                    {{ isStorageHealthy(storagePath) ? 'Healthy' : 'Unhealthy' }}
                  </v-chip>
                </div>

                <div>
                  <div class="text-caption text-secondary mb-1">
                    {{ t('storage.urls') }}
                  </div>
                  <div class="text-subtitle-1">
                    {{ storagePath.urls }}
                  </div>
                </div>

                <div>
                  <div class="text-caption text-secondary mb-1">
                    {{ t('storage.type') }}
                  </div>
                  <v-chip
                    size="small"
                    :color="getColorByType(getStorageType(storagePath))"
                    label
                  >
                    {{ getStorageType(storagePath) }}
                  </v-chip>
                </div>
              </div>
            </v-col>

            <v-col
              cols="12"
              md="6"
            >
              <div class="d-flex flex-column gap-3">
                <div>
                  <div class="text-caption text-secondary mb-1">
                    {{ t('storage.lastHeartbeat') }}
                  </div>
                  <div :class="{'text-error': isHeartbeatStale(storagePath.lastHeartbeat)}">
                    {{ getRelativeTime(storagePath.lastHeartbeat) }}
                    <small class="text-secondary">
                      ({{ new Date(storagePath.lastHeartbeat).toLocaleString() }})
                    </small>
                  </div>
                </div>

                <div v-if="storagePath.heartbeatErr">
                  <div class="text-caption text-error mb-1">
                    {{ t('storage.heartbeatError') }}
                  </div>
                  <div class="text-subtitle-1 text-error">
                    {{ storagePath.heartbeatErr }}
                  </div>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider class="my-2" />

        <!-- Storage metrics -->
        <v-card-text class="pt-0 pb-2">
          <h3 class="text-subtitle-1 font-weight-medium mb-2">
            {{ t('storage.diskUsage') }}
          </h3>

          <div>
            <v-row>
              <v-col
                cols="12"
                sm="4"
              >
                <div class="text-center mb-3">
                  <div class="text-h6">
                    {{ formatBytes(storagePath.capacity).combined }}
                  </div>
                  <div class="text-caption text-secondary">
                    {{ t('storage.capacity') }}
                  </div>
                </div>
              </v-col>

              <v-col
                cols="12"
                sm="4"
              >
                <div class="text-center mb-3">
                  <div class="text-h6">
                    {{ formatBytes(storagePath.used).combined }}
                  </div>
                  <div class="text-caption text-secondary">
                    {{ t('storage.used') }}
                  </div>
                </div>
              </v-col>

              <v-col
                cols="12"
                sm="4"
              >
                <div class="text-center mb-3">
                  <div class="text-h6">
                    {{ formatBytes(storagePath.available).combined }}
                  </div>
                  <div class="text-caption text-secondary">
                    {{ t('storage.available') }}
                  </div>
                </div>
              </v-col>
            </v-row>

            <div class="mt-3">
              <div class="d-flex justify-space-between align-center mb-1">
                <span class="text-body-2">{{ t('storage.usage') }}</span>
                <span class="text-body-2 font-weight-medium">
                  {{ getUsagePercentage(storagePath.capacity, storagePath.available) }}%
                </span>
              </div>
              <v-progress-linear
                :model-value="getUsagePercentage(storagePath.capacity, storagePath.available)"
                height="12"
                rounded
                :color="getUsageColor(getUsagePercentage(storagePath.capacity, storagePath.available))"
              />
            </div>
          </div>
        </v-card-text>

        <v-divider
          v-if="storageLiveness"
          class="mt-2 mb-1"
        />

        <!-- Storage Liveness -->
        <v-card-text
          v-if="storageLiveness"
          class="pt-0 pb-2"
        >
          <h3 class="text-subtitle-1 font-weight-medium mb-3">
            {{ t('storage.liveness', 'Liveness Status') }}
          </h3>

          <v-card
            variant="outlined"
            flat
            class="mb-0"
          >
            <v-card-text>
              <v-row>
                <v-col
                  cols="12"
                  md="6"
                >
                  <div class="d-flex flex-column gap-3">
                    <div>
                      <div class="text-caption text-secondary mb-1">
                        URL
                      </div>
                      <div class="text-subtitle-1">
                        {{ storageLiveness.url }}
                      </div>
                    </div>

                    <div>
                      <div class="text-caption text-secondary mb-1">
                        {{ t('storage.lastChecked', 'Last Checked') }}
                      </div>
                      <div class="text-subtitle-1">
                        {{ getRelativeTime(storageLiveness.lastChecked) }}
                        <small class="text-secondary">
                          ({{ new Date(storageLiveness.lastChecked).toLocaleString() }})
                        </small>
                      </div>
                    </div>
                  </div>
                </v-col>

                <v-col
                  cols="12"
                  md="6"
                >
                  <div class="d-flex flex-column gap-3">
                    <div>
                      <div class="text-caption text-secondary mb-1">
                        {{ t('storage.lastLive', 'Last Live') }}
                      </div>
                      <div class="text-subtitle-1">
                        <template v-if="storageLiveness.lastLive">
                          {{ getRelativeTime(storageLiveness.lastLive) }}
                          <small class="text-secondary">
                            ({{ new Date(storageLiveness.lastLive).toLocaleString() }})
                          </small>
                        </template>
                        <template v-else>
                          -
                        </template>
                      </div>
                    </div>

                    <div v-if="storageLiveness.lastDead">
                      <div class="text-caption text-error mb-1">
                        {{ t('storage.lastDead', 'Last Dead') }}
                      </div>
                      <div class="text-subtitle-1">
                        {{ getRelativeTime(storageLiveness.lastDead) }}
                        <small class="text-secondary">
                          ({{ new Date(storageLiveness.lastDead).toLocaleString() }})
                        </small>
                      </div>
                    </div>

                    <div v-if="storageLiveness.lastDeadReason">
                      <div class="text-caption text-error mb-1">
                        {{ t('storage.lastDeadReason', 'Dead Reason') }}
                      </div>
                      <div class="text-subtitle-1 text-error">
                        {{ storageLiveness.lastDeadReason }}
                      </div>
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-card-text>
      </template>

      <v-divider class="mt-2" />

      <v-card-actions>
        <v-spacer />
        <v-btn
          color="primary"
          variant="text"
          @click="dialog = false"
        >
          {{ t('common.Close') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.gap-3 {
  gap: 1rem;
}
</style>
