<script setup lang="ts">
import { ref, computed, ComputedRef } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { IpniTask } from '@/typed-graph'
import { useI18n } from 'vue-i18n'
import {
  IconRefresh,
  IconCheck,
  IconMinus,
  IconX,
  IconFilterOff,
  IconFileSearch
} from '@tabler/icons-vue'

const { t } = useI18n()

const search = ref('')

// filter
const status = ref<string | undefined>(undefined)
const spId = ref<string | undefined>(undefined)

const statusOptions = ref([
  { title: t('ipni.status.all'), value: undefined },
  { title: t('ipni.status.complete'), value: 'COMPLETE' },
  { title: t('ipni.status.pending'), value: 'PENDING' },
  { title: t('ipni.status.removed'), value: 'REMOVED' }
])

const selectedStatusOption = ref(statusOptions.value[0])

const { result, loading, refetch } = useQuery(
  gql`
    query GetIPNITasks($limit: Int, $spId: ActorID, $isRm: Boolean) {
      ipniTasks(limit: $limit, spId: $spId, isRm: $isRm) {
        taskId
        contextId
        complete
        isRm
        sector
        sectorOffset
        spId
        provider
        createdAt
      }
      ipniTasksCount(spId: $spId, isRm: $isRm)
    }
  `,
  () => ({
    limit: null, // No limit since we're using client-side pagination
    spId: spId.value ? spId.value : undefined,
    isRm: status.value === 'REMOVED' ? true : undefined
  }),
  {
    debounce: 500,
  }
)

const allTasks: ComputedRef<IpniTask[]> = computed(() => result.value?.ipniTasks || [])

// Filter tasks based on selected status
const filteredTasks = computed(() => {
  let tasks = [...allTasks.value]

  // Filter by status if selected
  if (status.value) {
    if (status.value === 'COMPLETE') {
      tasks = tasks.filter(task => task.complete && !task.isRm)
    } else if (status.value === 'PENDING') {
      tasks = tasks.filter(task => !task.complete && !task.isRm)
    }
    // REMOVED is already filtered at the query level via isRm
  }

  return tasks
})

const clearFilters = () => {
  search.value = ''
  status.value = undefined
  spId.value = undefined
  selectedStatusOption.value = statusOptions.value[0]
}

// Status mapping for tasks
const getStatus = (task: IpniTask) => {
  if (task.isRm) {
    return {
      color: 'error',
      icon: IconX,
      text: t('ipni.status.removed')
    }
  }

  if (task.complete) {
    return {
      color: 'success',
      icon: IconCheck,
      text: t('ipni.status.complete')
    }
  }

  return {
    color: 'warning',
    icon: IconMinus,
    text: t('ipni.status.pending')
  }
}

// Table headers
const headers = [
  { title: "Task ID", key: 'taskId', sortable: true },
  { title: "Provider", key: 'provider', sortable: true },
  { title: "Sector", key: 'sector', sortable: true },
  { title: "Status", key: 'status', sortable: true },
  { title: "Created At", key: 'createdAt', sortable: true }
]

// Watch for status option change
const onStatusChange = (option: { value: string | undefined }) => {
  status.value = option.value
}
</script>

<template>
  <v-card class="mb-4">
    <v-data-table-virtual
      :headers="headers"
      :items="filteredTasks"
      :search="search"
      :loading="loading"
      hover
      fixed-header
    >
      <template #top>
        <v-toolbar
          flat
          color="transparent"
          class="pb-4 mb-2 border-b"
        >
          <v-toolbar-title>Tasks</v-toolbar-title>
          <v-spacer />

          <v-text-field
            v-model="search"
            append-inner-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
            density="compact"
            style="max-width: 250px;"
            class="mr-4"
            variant="outlined"
          />

          <MinerSelectInput
            v-model="spId"
            label="Provider"
            density="compact"
            variant="outlined"
            hide-details
            class="mr-4"
            style="max-width: 180px;"
          />

          <v-select
            v-model="selectedStatusOption"
            :items="statusOptions"
            item-title="title"
            item-value="value"
            label="Status"
            variant="outlined"
            density="compact"
            hide-details
            return-object
            style="max-width: 150px;"
            class="mr-4"
            @update:model-value="onStatusChange"
          />

          <v-btn
            variant="text"
            color="error"
            :prepend-icon="IconFilterOff"
            class="mr-2"
            @click="clearFilters"
          >
            Clear
          </v-btn>

          <v-btn
            variant="text"
            color="primary"
            :icon="IconRefresh"
            :loading="loading"
            @click="refetch"
          />
        </v-toolbar>
      </template>

      <template #no-data>
        <div class="pa-8 text-center">
          <v-icon
            size="48"
            class="mb-2 text-medium-emphasis"
          >
            <component :is="IconFileSearch" />
          </v-icon>
          <div class="text-medium-emphasis">
            No tasks found
          </div>
        </div>
      </template>

      <template #item.provider="{ item }">
        {{ item.spId || item.provider || '-' }}
      </template>

      <template #item.sector="{ item }">
        {{ item.sector ? `${item.sector}:${item.sectorOffset}` : '-' }}
      </template>

      <template #item.status="{ item }">
        <v-chip
          :color="getStatus(item).color"
          size="small"
          variant="tonal"
          class="text-none"
        >
          <component
            :is="getStatus(item).icon"
            class="mr-1"
            size="14"
          />
          {{ getStatus(item).text }}
        </v-chip>
      </template>

      <template #item.createdAt="{ value }">
        {{ value ? new Date(value).toLocaleString() : '-' }}
      </template>
    </v-data-table-virtual>
  </v-card>
</template>

<style scoped>
/* Ensure consistent column widths */
:deep(th) {
  white-space: nowrap;
}

/* Add pointer cursor to rows */
:deep(.v-data-table tbody tr) {
  cursor: pointer;
}

/* Full width table */
:deep(.v-data-table) {
  width: 100%;
}

/* Details table styling */
:deep(.v-table th) {
  width: 150px;
  text-align: left;
  vertical-align: top;
}

:deep(.v-table td) {
  word-break: break-all;
}
</style>
