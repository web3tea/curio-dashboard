<script setup lang="ts">
import { useQuery } from '@vue/apollo-composable'
import { computed, ComputedRef, ref } from 'vue'
import { Task } from '@/typed-graph'
import { GetRunningTasks } from '@/gql/task'
import { IconReload, IconSearch } from '@tabler/icons-vue'
import { useI18n } from 'vue-i18n'
import { getRelativeTime } from '@/utils/helpers/time'
import { useLocalState } from '@/utils/helpers/localState'

const { t } = useI18n()

const { result, loading, refetch } = useQuery(GetRunningTasks, null, () => ({
  fetchPolicy: 'cache-and-network',
  pollInterval: 3000,
}))

const items: ComputedRef<[Task]> = computed(() => result.value?.tasks || [])
const headers = [
  { title: 'ID', key: 'id' },
  { title: 'Name', key: 'name' },
  { title: 'Posted Time', key: 'postedTime' },
  { title: 'Update Time', key: 'updateTime' },
  { title: 'Added By', key: 'addedByID' },
  { title: 'Owner', key: 'ownerId' },
  { title: 'Initiated By', key: 'initiatedByID' },
  { title: 'Previous Task', key: 'previousTaskID' },
]

const sortBy = [
  {
    key: 'postedTime',
    order: 'desc',
  }
] as const

interface TableSettings {
  enableGrouping: boolean;
  showBackgroundTasks: boolean;
}

const tableSettings = useLocalState<TableSettings>('active-task-list-table-settings', {
  enableGrouping: true,
  showBackgroundTasks: false
})

const searchValue = ref('')

const filteredItems = computed(() => {
  if (tableSettings.value.showBackgroundTasks) {
    return items.value
  } else {
    return items.value.filter(task => !task.name.startsWith('bg:'))
  }
})

const dynamicGroupBy = computed(() => {
  if (tableSettings.value.enableGrouping) {
    return [
      {
        key: 'name',
        order: 'asc',
      }
    ] as const
  } else {
    return [] // empty array means no grouping
  }
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
              md="6"
              class="d-flex align-center"
            >
              <v-switch
                v-model="tableSettings.enableGrouping"
                :label="t('activeTask.groupByName')"
                hide-details
                density="compact"
                color="primary"
                class="mr-6"
              />
              <v-switch
                v-model="tableSettings.showBackgroundTasks"
                :label="t('activeTask.showBackgroundTasks')"
                hide-details
                density="compact"
                color="primary"
              />
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
            :items="filteredItems"
            :loading="loading"
            :search="searchValue"
            :group-by="dynamicGroupBy"
            :sort-by="sortBy"
          >
            <template #item.name="{ value }">
              <v-chip>{{ value }}</v-chip>
            </template>
            <template #item.postedTime="{ value }">
              {{ getRelativeTime(value, "short") }}
            </template>
            <template #item.updateTime="{ value }">
              {{ getRelativeTime(value, "short") }}
            </template>

            <template #item.ownerId="{item}">
              <template v-if="item.owner">
                <RouterLink
                  v-if="item.ownerId"
                  :to="{ name: 'MachineInfo', params: { id: Number(item.ownerId) } }"
                >
                  {{ item.owner.hostAndPort }}
                </RouterLink>
                <template v-else>
                  N/A
                </template>
              </template>
              <template v-else>
                {{ item.ownerId || 'N/A' }}
              </template>
            </template>
            <template #item.addedByID="{ item }">
              <template v-if="item.addedBy">
                <RouterLink
                  v-if="item.addedByID"
                  :to="{ name: 'MachineInfo', params: { id: Number(item.addedByID) } }"
                >
                  {{ item.addedBy.hostAndPort }}
                </RouterLink>
                <template v-else>
                  N/A
                </template>
              </template>
              <template v-else>
                {{ item.addedByID || 'N/A' }}
              </template>
            </template>
            <template #item.initiatedByID="{item}">
              <template v-if="item.initiatedBy">
                <RouterLink
                  v-if="item.initiatedByID"
                  :to="{ name: 'MachineInfo', params: { id: Number(item.initiatedByID) } }"
                >
                  {{ item.initiatedBy.hostAndPort }}
                </RouterLink>
                <template v-else>
                  N/A
                </template>
              </template>
              <template v-else>
                {{ item.initiatedByID || 'N/A' }}
              </template>
            </template>
            <template #item.previousTaskID="{ item }">
              {{ item.previousTaskID || 'N/A' }}
            </template>
          </v-data-table-virtual>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped lang="scss">

</style>
