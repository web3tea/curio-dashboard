<script setup lang="ts">
import { computed, ref, ComputedRef } from 'vue'
import { useLazyQuery } from '@vue/apollo-composable'
import { GetRunningTask } from '@/gql/task'
import { Task, Machine } from '@/typed-graph'
import { IconReload } from '@tabler/icons-vue'
import { getRelativeTime } from '@/utils/helpers/time'

const props = defineProps({
  id: {
    type: Number,
    default: null,
  },
  maxWidth: {
    type: [String, Number],
    default: '50%',
  },
})
const shouldFetch = ref(false)
const dialogOpen = ref(false)

const { result, load, loading, refetch } = useLazyQuery(GetRunningTask, {
  id: props.id,
}, () => ({
  fetchPolicy: 'cache-first'
}))

const task: ComputedRef<Task> = computed(() => result.value?.task || {})

const handleDialogOpen = () => {
  if (!shouldFetch.value) {
    shouldFetch.value = true
    load()
  }
}

const getHostInfo = (entity: Machine | undefined | null = undefined) => {
  return entity?.hostAndPort || '-'
}

</script>

<template>
  <v-dialog
    v-model="dialogOpen"
    :max-width="maxWidth"
  >
    <template #activator="{ props: pp }">
      <v-btn
        v-bind="pp"
        density="compact"
        color="primary"
        @click="handleDialogOpen"
      >
        {{ id }}
      </v-btn>
    </template>
    <template #default="{}">
      <v-card :loading="loading">
        <v-card-item>
          <div class="d-flex justify-space-between">
            <v-card-title>
              Task Details
            </v-card-title>
            <v-btn
              :disabled="loading"
              :icon="IconReload"
              rounded
              variant="text"
              size="small"
              @click="refetch"
            />
          </div>
        </v-card-item>
        <v-card-text>
          <div
            v-if="loading"
            class="d-flex justify-center align-center my-4"
          >
            <v-progress-circular
              indeterminate
              color="primary"
            />
          </div>

          <div
            v-else-if="task.id"
            class="task-details"
          >
            <v-row>
              <v-col cols="12">
                <v-card
                  variant="outlined"
                  class="mb-4"
                >
                  <v-card-title class="text-subtitle-1 py-2">
                    Basic Information
                  </v-card-title>
                  <v-card-text>
                    <v-row dense>
                      <v-col
                        cols="12"
                        sm="6"
                        class="py-1"
                      >
                        <div class="text-caption text-medium-emphasis">
                          Task ID
                        </div>
                        <div>{{ task.id }}</div>
                      </v-col>
                      <v-col
                        cols="12"
                        sm="6"
                        class="py-1"
                      >
                        <div class="text-caption text-medium-emphasis">
                          Task Name
                        </div>
                        <div>{{ task.name || '-' }}</div>
                      </v-col>
                      <v-col
                        cols="12"
                        sm="6"
                        class="py-1"
                      >
                        <div class="text-caption text-medium-emphasis">
                          Posted Time
                        </div>
                        <div>{{ getRelativeTime(task.postedTime, 'short') }}</div>
                      </v-col>
                      <v-col
                        cols="12"
                        sm="6"
                        class="py-1"
                      >
                        <div class="text-caption text-medium-emphasis">
                          Last Updated
                        </div>
                        <div>{{ getRelativeTime(task.updateTime, 'short') }}</div>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12">
                <v-card
                  variant="outlined"
                  class="mb-4"
                >
                  <v-card-title class="text-subtitle-1 py-2">
                    Ownership Information
                  </v-card-title>
                  <v-card-text>
                    <v-row dense>
                      <v-col
                        cols="12"
                        sm="6"
                        class="py-1"
                      >
                        <div class="text-caption text-medium-emphasis">
                          Initiated By ID
                        </div>
                        <div>{{ task.initiatedByID || '-' }}</div>
                      </v-col>
                      <v-col
                        cols="12"
                        sm="6"
                        class="py-1"
                      >
                        <div class="text-caption text-medium-emphasis">
                          Initiated By Host
                        </div>
                        <div>{{ getHostInfo(task.initiatedBy) }}</div>
                      </v-col>
                      <v-col
                        cols="12"
                        sm="6"
                        class="py-1"
                      >
                        <div class="text-caption text-medium-emphasis">
                          Owner ID
                        </div>
                        <div>{{ task.ownerId || '-' }}</div>
                      </v-col>
                      <v-col
                        cols="12"
                        sm="6"
                        class="py-1"
                      >
                        <div class="text-caption text-medium-emphasis">
                          Owner Host
                        </div>
                        <div>{{ getHostInfo(task.owner) }}</div>
                      </v-col>
                      <v-col
                        cols="12"
                        sm="6"
                        class="py-1"
                      >
                        <div class="text-caption text-medium-emphasis">
                          Added By ID
                        </div>
                        <div>{{ task.addedByID || '-' }}</div>
                      </v-col>
                      <v-col
                        cols="12"
                        sm="6"
                        class="py-1"
                      >
                        <div class="text-caption text-medium-emphasis">
                          Added By Host
                        </div>
                        <div>{{ getHostInfo(task.addedBy) }}</div>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col
                v-if="task.previousTaskID"
                cols="12"
              >
                <v-card variant="outlined">
                  <v-card-title class="text-subtitle-1 py-2">
                    Related Tasks
                  </v-card-title>
                  <v-card-text>
                    <v-row dense>
                      <v-col
                        cols="12"
                        sm="6"
                        class="py-1"
                      >
                        <div class="text-caption text-medium-emphasis">
                          Previous Task ID
                        </div>
                        <div>{{ task.previousTaskID || '-' }}</div>
                      </v-col>
                      <v-col
                        cols="12"
                        sm="6"
                        class="py-1"
                      >
                        <div class="text-caption text-medium-emphasis">
                          Previous Task Name
                        </div>
                        <div>{{ task.previousTask?.name || '-' }}</div>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </div>

          <div
            v-else
            class="text-center pa-4"
          >
            <v-icon
              size="large"
              color="warning"
              class="mb-2"
            >
              mdi-alert-circle-outline
            </v-icon>
            <div>No task data found for ID: {{ id }}</div>
          </div>
        </v-card-text>
      </v-card>
    </template>
  </v-dialog>
</template>
<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.task-details .v-card-title {
  background-color: rgba(0, 0, 0, 0.03);
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}
</style>
