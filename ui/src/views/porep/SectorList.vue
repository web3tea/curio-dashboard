<script setup lang="ts">
import { useMutation, useQuery } from '@vue/apollo-composable'
import { computed, ComputedRef, ref, watch } from 'vue'
import { GetSectorsPoreps } from '@/gql/porep'
import { Porep } from '@/typed-graph'
import { IconReload, IconSearch } from '@tabler/icons-vue'
import { getRelativeTime } from '@/utils/helpers/time'
import SectorRemoveDialog from '@/views/sectors/SectorRemoveDialog.vue'
import { RestartAllFailedSector } from '@/gql/sector'
import SectorRestart from '@/views/sectors/SectorRestart.vue'
import { useI18n } from 'vue-i18n'
import { useNotificationStore } from '@/stores/notification'

const notificationStore = useNotificationStore()
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
  { title: 'Miner', key: 'spId' },
  { title: 'Sector', key: 'sectorNumber' },
  { title: 'State', key: 'status' },
  { title: 'Created', key: 'createTime' },
  { title: 'Task', key: 'task' },
  { title: 'Actions', key: 'actions' },
]

const searchValue = ref('')
const selectStatus = ref(null)
const filterItems = computed(() => {
  return items.value.filter(item => {
    return !(selectStatus.value && item.status !== selectStatus.value)
  })
})

const selected = ref([])

function stateColor (state: string) {
  if (state === 'Failed') {
    return 'error'
  } else if (state === 'Unknown') {
    return 'warning'
  } else {
    return 'success'
  }
}

const { mutate: restartAll, loading: restartLoading, onError, onDone } = useMutation(RestartAllFailedSector)

onError(e => {
  notificationStore.error(e.message)
})

onDone(() => {
  notificationStore.success('Restarting all failed sectors')
})

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
                :color="stateColor(item.status)"
                label
                size="small"
                variant="flat"
              >
                {{ item.status }}
              </v-chip>
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
              {{ getRelativeTime(value, "short") }}
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
