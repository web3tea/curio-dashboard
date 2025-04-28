<script setup lang="ts">
import { useMutation, useQuery } from '@vue/apollo-composable'
import { computed, ComputedRef, ref, watch } from 'vue'
import { GetSectorsPoreps } from '@/gql/porep'
import { Porep, TaskStatus } from '@/typed-graph'
import { IconRefresh, IconSearch, IconSettings } from '@tabler/icons-vue'
import { getRelativeTime } from '@/utils/helpers/time'
import SectorRemoveDialog from '@/views/sectors/SectorRemoveDialog.vue'
import { RestartAllFailedSector } from '@/gql/sector'
import SectorRestart from '@/views/sectors/SectorRestart.vue'
import { useI18n } from 'vue-i18n'
import { useNotificationStore } from '@/stores/notification'

const ns = useNotificationStore()
const { t } = useI18n()

const { result, loading, refetch } = useQuery(GetSectorsPoreps, null, () => ({
  fetchPolicy: 'network-only',
  pollInterval: 5000,
}))
const items: ComputedRef<[Porep]> = computed(() => result.value?.poreps || [])
watch(items, () => {
  selected.value = []
})

const headers = [
  { title: 'Sector', key: 'sectorNumber', width: '50px' },
  { title: 'Miner', key: 'spId',width: '100px' },
  { title: 'CreatetAt', key: 'createTime', width: '120px' },
  { title: 'Progress', key: 'progress', width: '250px', sortable: false },
  { title: 'Status', key: 'status', width: '100px' },
  { title: 'Stages', key: 'compactStages', sortable: false },
  { title: 'Actions', key: 'actions', sortable: false, width: '100px' },
]

const searchValue = ref('')
const selectStatus = ref(null)
const filterItems = computed(() => {
  return items.value.filter(item => {
    return !(selectStatus.value && item.status !== selectStatus.value)
  })
})

const selected = ref([])

const { mutate: restartAll, loading: restartLoading, onError, onDone } = useMutation(RestartAllFailedSector)

onError(e => {
  ns.error(e.message)
})

onDone(() => {
  ns.success('Restarting all failed sectors')
})

function getStatusColor(item: TaskStatus) {
  switch (item) {
  case "Failed":
    return 'error'
  case "Running":
    return 'primary'
  case "Completed":
    return 'success'
  default:
    return 'secondary'
  }
}

function progressLabel(item: Porep) {
  switch (item.status) {
  case "Failed":
    return 'Failed'
  case "Completed":
    return 'Completed'
  }

  switch (item.stage) {
  case "SDR":
    return item.stage + " computing"
  case "TreeC":
    return item.stage + " computing"
  case "TreeR":
    return item.stage + " computing"
  case "TreeD":
    return item.stage + " computing"
  case "Synthetic":
    return item.stage + " computing"
  case "PrecommitMsg":
    return "Precommit message"
  case "PrecommitMsgWait":
    return "Waiting for precommit message"
  case "WaitSeed":
    return item.stage
  case "Porep":
    return item.stage + " computing"
  case "CommitMsg":
    return "Commit message"
  case "CommitMsgWait":
    return "Waiting for commit message"
  case "Finalize":
    return item.stage
  case "MoveStorage":
    return item.stage
  default:
    return item.stage
  }
}

function progressValue(item: Porep) {
  switch (item.status) {
  case "Failed":
    return 0
  case "Completed":
    return 100
  }
  switch (item.stage) {
  case "SDR":
    if (item.currentTask && item.currentTask.postedTime) {
      // SDR takes approximately 3 hours (10800 seconds) to complete
      const sdrTotalTime = 3 * 60 * 60 * 1000 // 3 hours in milliseconds
      const startTime = new Date(item.currentTask.postedTime).getTime()
      const currentTime = new Date().getTime()
      const elapsedTime = currentTime - startTime

      // Calculate progress percentage (0-35)
      const sdrProgress = Math.min(elapsedTime / sdrTotalTime, 1) * 35
      return Math.round(sdrProgress)
    }
    return 10
  case "TreeD":
    return 40
  case "TreeC":
    return 45
  case "TreeR":
    return 45
  case "Synthetic":
    return 55
  case "PrecommitMsg":
    return 60
  case "PrecommitMsgWait":
    return 65
  case "WaitSeed":
    return 75
  case "Porep":
    return 80
  case "CommitMsg":
    return 85
  case "CommitMsgWait":
    return 90
  case "Finalize":
    return 95
  case "MoveStorage":
    return 100
  default:
    return 0
  }
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
              <v-btn
                color="primary"
                :loading="restartLoading"
                @click="restartAll"
              >
                Restart All
              </v-btn>
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
                  @click="refetch"
                />
              </div>
            </v-col>
          </v-row>
        </v-card-item>
        <v-divider />
        <v-card-text class="pa-0">
          <v-data-table-virtual
            v-model="selected"
            fixed-header
            :headers="headers"
            hover
            item-value="id"
            :items="filterItems"
            :loading="loading"
            return-object
            :search="searchValue"
            show-select
          >
            <template #top>
              <v-card-actions v-if="selected.length > 0">
                <SectorRemoveDialog :sectors="selected" />
                <SectorRestart :sectors="selected" />
              </v-card-actions>
            </template>
            <template #item.spId="{ value }">
              <RouterLink :to="{ name: 'MinerDetails', params: { id: value } }">
                {{ value }}
              </RouterLink>
            </template>
            <template #item.sectorNumber="{ item }">
              <RouterLink :to="{ name: 'SectorDetails', params: { miner: item.spId, sectorNumber: item.sectorNumber } }">
                {{ item.sectorNumber }}
              </RouterLink>
            </template>
            <template #item.status="{ item }">
              <v-chip
                :color="getStatusColor(item.status)"
                label
                size="small"
                variant="flat"
              >
                {{ item.status }}
              </v-chip>
            </template>
            <template #item.progress="{ item }">
              <div class="d-flex flex-column">
                <div class="d-flex justify-space-between">
                  <span class="text-body-2">{{ progressLabel(item) }}</span>
                  <span class="text-caption">{{ progressValue(item) }}%</span>
                </div>
                <v-progress-linear
                  :model-value="progressValue(item)"
                  :color="getStatusColor(item.status)"
                  height="8"
                  rounded
                  class="mt-1"
                />
              </div>
            </template>
            <template #item.compactStages="{ item }">
              <div class="stage-chips-container">
                <v-tooltip
                  v-for="stage in item.compactStages"
                  :key="stage.name"
                  location="bottom"
                >
                  <template #activator="{ props }">
                    <v-chip
                      :color="getStatusColor(stage.status)"
                      class="mr-1"
                      size="x-small"
                      :variant="stage.status !== 'Running' ? 'outlined' : undefined"
                      v-bind="props"
                    >
                      {{ stage.name }}
                      <v-icon
                        v-if="stage.status === 'Running'"
                        end
                        spin
                        class="ml-1"
                        :icon="IconSettings"
                      />
                    </v-chip>
                  </template>
                  <div>
                    <div v-if="stage.taskId">
                      Task ID: {{ stage.taskId }}
                    </div>
                    <div v-else>
                      No task associated
                    </div>
                    <div v-if="stage.status === 'Running' && item.currentTask">
                      <v-divider class="my-1" />
                      <div>Machine: {{ item.currentTask.owner?.hostAndPort }}</div>
                      <div>Started: {{ getRelativeTime(item.currentTask.postedTime) }}</div>
                    </div>
                  </div>
                </v-tooltip>
              </div>
            </template>
            <template #item.task="{ item }">
              <div class="text-subtitle-1">
                <span class="font-weight-semibold mr-2">Task ID :</span>
                <TaskDetailsDialog :id="item.currentTask?.id" />
              </div>
              <div class="text-subtitle-1">
                <span class="font-weight-semibold mr-2">Posted :</span>
                <span class="text-medium-emphasis">{{ item.currentTask?.postedTime ? getRelativeTime(item.currentTask?.postedTime) : 'N/A' }}</span>
              </div>
            </template>
            <template #item.createTime="{value}">
              {{ getRelativeTime(value) }}
            </template>
            <template #item.actions="{ item }">
              <SectorRemoveDialog
                :sectors="[item]"
                use-icon
              />
              <SectorRestart
                v-if="item.failed"
                :sectors="[item]"
                use-icon
              />
            </template>
          </v-data-table-virtual>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped lang="scss">

</style>
