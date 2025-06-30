<script setup lang="ts">
import { computed, ComputedRef, ref, onActivated, onDeactivated } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { gql } from 'graphql-tag'
import { IpniAdvertisement } from '@/typed-graph'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { formatBytes } from '@/utils/helpers/formatBytes'
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

const enabled = ref(true)

const { result, loading, error, refetch } = useQuery(
  gql`
    query GetRecentAdvertisements($offset: Int!, $limit: Int!) {
      ipniAdvertisements(offset: $offset, limit: $limit) {
        orderNumber
        pieceCid
        pieceSize
        provider {
          peerID
          spID
        }
        isSkip
        isRm
      }
    }
  `,
  {
    offset: 0,
    limit: props.limit,
  },
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

const advertisements: ComputedRef<IpniAdvertisement[]> = computed(() => result.value?.ipniAdvertisements || [])

// Status mapping for advertisements
const getStatus = (ad: IpniAdvertisement) => {
  if (ad.isRm) {
    return {
      color: 'error',
      icon: IconX,
      text: t('ipni.status.removed')
    }
  }

  if (ad.isSkip) {
    return {
      color: 'grey',
      icon: IconMinus,
      text: t('ipni.status.skipped')
    }
  }

  return {
    color: 'success',
    icon: IconCheck,
    text: t('ipni.status.indexed')
  }
}

// Navigate to all advertisements
const viewAllAdvertisements = () => {
  router.push({ name: 'IPNIAdvertisements' })
}

// Table headers
const headers = [
  { title: "Piece CID", key: 'pieceCid' },
  { title: "Provider", key: 'provider' },
  { title: "Piece Size", key: 'pieceSize' },
  { title: "Status", key: 'status' }
]

defineExpose({
  refetch
})
</script>

<template>
  <v-card height="100%">
    <v-card-title class="d-flex justify-space-between align-center">
      <div>{{ t('ipni.recentAdvertisements') }}</div>
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
        :items="advertisements"
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
          <div class="pa-4 text-center">
            <v-icon
              size="48"
              class="mb-2 text-medium-emphasis"
            >
              <component :is="IconFileSearch" />
            </v-icon>
            <div class="text-medium-emphasis">
              {{ t('ipni.noAdvertisements') }}
            </div>
          </div>
        </template>

        <template #item.pieceCid="{ value }">
          <TruncatedText
            :text="value"
            :max-length="50"
          />
        </template>

        <template #item.provider="{ value }">
          {{ value.spID || '-' }}
        </template>

        <template #item.pieceSize="{ value }">
          {{ formatBytes(value).combined }}
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
        @click="viewAllAdvertisements"
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
