<script setup lang="ts">
import { computed, ComputedRef, ref, onActivated, onDeactivated } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { IpniProvider } from '@/typed-graph'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import {
  IconRefresh,
  IconChevronRight,
  IconFileSearch,
  IconCircleCheck,
  IconCircleX,
  IconQuestionMark
} from '@tabler/icons-vue'

const props = defineProps({
  limit: {
    type: Number,
    default: 5
  }
})

const { t } = useI18n()
const router = useRouter()

const enabled = ref(true)

const { result, loading, error, refetch } = useQuery(
  gql`
    query GetIPNIProviders {
      ipniProviders {
        spID
        head
        status
        adCount
      }
    }
  `,
  null,
  () => ({
    enabled: enabled.value,
    pollInterval: 5000,
  })
)

onActivated(() => {
  enabled.value = true
})

onDeactivated(() => {
  enabled.value = false
})

const allProviders: ComputedRef<IpniProvider[]> = computed(() => result.value?.ipniProviders || [])

// Sort providers by status (active first) and limit to specified number
const providers = computed(() => {
  return [...allProviders.value]
    .sort((a, b) => {
      // Sort by status first (ACTIVE > INACTIVE > UNKNOWN)
      if (a.status !== b.status) {
        if (a.status === 'ACTIVE') return -1
        if (b.status === 'ACTIVE') return 1
        if (a.status === 'INACTIVE' && b.status === 'UNKNOWN') return -1
        return 1
      }
      // Then sort by spID as a fallback
      return Number(a.spID) - Number(b.spID)
    })
    .slice(0, props.limit)
})

// Status mapping for providers
const getStatus = (provider: IpniProvider) => {
  switch (provider.status) {
  case 'ACTIVE':
    return {
      color: 'success',
      icon: IconCircleCheck,
      text: t('ipni.status.active')
    }
  case 'INACTIVE':
    return {
      color: 'error',
      icon: IconCircleX,
      text: t('ipni.status.inactive')
    }
  default:
    return {
      color: 'grey',
      icon: IconQuestionMark,
      text: t('ipni.status.unknown')
    }
  }
}

// Navigate to all providers
const viewAllProviders = () => {
  router.push({ name: 'IPNIProviders' })
}

// Table headers
const headers = [
  { title: "SP ID", key: 'spID' },
  { title: "Head", key: 'head' },
  { title: "Ads Count", key: 'adCount' },
  { title: "Status", key: 'status' }
]

defineExpose({
  refetch
})
</script>

<template>
  <v-card height="100%">
    <v-card-title class="d-flex justify-space-between align-center">
      <div>{{ t('ipni.topProviders') }}</div>
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
        :items="providers"
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
              {{ t('ipni.noProviders') }}
            </div>
          </div>
        </template>

        <template #item.spID="{ value }">
          {{ value }}
        </template>

        <template #item.head="{ value }">
          <TruncatedText
            :text="value"
            :max-length="50"
          />
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
        @click="viewAllProviders"
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
