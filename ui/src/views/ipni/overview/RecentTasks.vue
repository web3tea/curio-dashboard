<script setup lang="ts">
import { computed, ComputedRef } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { gql } from 'graphql-tag'
import { IpniTask } from '@/typed-graph'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import {
  IconRefresh,
  IconCheck,
  IconMinus,
  IconX,
  IconChevronRight,
  IconFileSearch
} from '@tabler/icons-vue'

const props = defineProps({
  limit: {
    type: Number,
    default: 5
  }
})

const { t } = useI18n()
const router = useRouter()

const { result, loading, error, refetch } = useQuery(
  gql`
    query GetRecentTasks($limit: Int!) {
      ipniTasks(limit: $limit) {
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
    }
  `,
  {
    limit: props.limit,
  },
  {
    pollInterval: 5000,
  }
)

const tasks: ComputedRef<IpniTask[]> = computed(() => result.value?.ipniTasks || [])

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

// Navigate to all tasks
const viewAllTasks = () => {
  router.push({ name: 'IPNITasks' })
}

// Table headers
const headers = [
  { title: "Task ID", key: 'taskId' },
  { title: "Provider", key: 'provider' },
  { title: "Sector", key: 'sector' },
  { title: "Status", key: 'status' }
]

defineExpose({
  refetch
})
</script>

<template>
  <v-card height="100%">
    <v-card-title class="d-flex justify-space-between align-center">
      <div>{{ t('ipni.recentTasks') }}</div>
      <v-btn
        :icon="IconRefresh"
        variant="text"
        size="small"
        :loading="loading"
        @click="refetch()"
      />
    </v-card-title>
    <v-divider />

    <div class="card-content">
      <!-- Error state -->
      <div
        v-if="error"
        class="pa-4"
      >
        <v-alert
          type="error"
          :title="t('common.error')"
          :text="error.message"
          variant="tonal"
        />
      </div>

      <!-- Data table -->
      <v-data-table
        v-else
        :headers="headers"
        :items="tasks"
        :loading="loading"
        :items-per-page="limit"
        hide-default-footer
        density="compact"
        hover
      >
        <template #loading>
          <v-skeleton-loader
            v-for="i in limit"
            :key="i"
            class="mb-2"
          />
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
              {{ t('ipni.noTasks') }}
            </div>
          </div>
        </template>

        <template #item.taskId="{ value }">
          {{ value }}
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
      </v-data-table>
    </div>

    <v-divider />
    <v-card-actions class="pa-2">
      <v-btn
        variant="text"
        color="primary"
        @click="viewAllTasks"
      >
        {{ t('common.viewAll') }}
        <component
          :is="IconChevronRight"
          class="ml-1"
          size="16"
        />
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
/* Ensure consistent column widths */
:deep(th) {
  white-space: nowrap;
}

:deep(td) {
  white-space: nowrap;
}
</style>
