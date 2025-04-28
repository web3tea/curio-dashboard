<script setup lang="ts">
import { GetDealInfo } from '@/gql/deal'
import { DealInfo } from '@/typed-graph'
import { useQuery } from '@vue/apollo-composable'
import { IconRefresh } from '@tabler/icons-vue'
import { ComputedRef, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { formatBytes } from '@/utils/helpers/formatBytes'
import { getRelativeTime } from '@/utils/helpers/time'

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
})

const { t } = useI18n()

const { result, loading, refetch } = useQuery(GetDealInfo, {
  id: props.id,
}, {})
const item: ComputedRef<DealInfo> = computed(() => result.value?.marketDealInfo || {})

const dealProperties = computed(() => ({
  'Fast Retrieval': item.value.fastRetrieval,
  'Verified': item.value.verified,
  'DDO': item.value.isDdo,
  'Legacy': item.value.isLegacy,
  'Offline': item.value.offline,
  'IPNI Announced': item.value.announceToIpni,
  'Indexed': item.value.indexed,
}))

</script>
<template>
  <UiChildCard
    :title="t('fields.Deal Details')"
    :loading="loading"
  >
    <template #action>
      <v-btn
        :icon="IconRefresh"
        rounded
        variant="text"
        @click="refetch"
      />
    </template>
    <v-row>
      <v-col cols="12">
        <v-row>
          <v-col cols="3">
            Deal ID
          </v-col>
          <v-col cols="9">
            {{ item.id }}
            <CopyIcon :value="item.id" />
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="12">
        <v-row>
          <v-col cols="3">
            Storage Provider
          </v-col>
          <v-col cols="9">
            <RouterLink :to="{ name: 'MinerDetails', params: { id: item.spId } }">
              {{ item.spId }}
            </RouterLink>
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="12">
        <v-row>
          <v-col cols="3">
            Piece CID
          </v-col>
          <v-col cols="9">
            {{ item.pieceCid }}
            <CopyIcon :value="item.pieceCid" />
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12">
        <v-row>
          <v-col cols="3">
            Piece Size
          </v-col>
          <v-col cols="9">
            <v-tooltip>
              <template #activator="{ props: pp }">
                <span
                  v-bind="pp"
                  class="cursor-help"
                >
                  {{ formatBytes(item.pieceSize).combined }}
                </span>
              </template>
              <div class="text-center">
                <div>{{ item.pieceSize }} bytes</div>
              </div>
            </v-tooltip>
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="12">
        <v-row>
          <v-col cols="3">
            Chain Deal ID
          </v-col>
          <v-col cols="9">
            {{ item.chainDealId || '-' }}
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12">
        <v-row>
          <v-col cols="3">
            Sector
          </v-col>
          <v-col cols="9">
            {{ item.sector || '-' }}
          </v-col>
        </v-row>
      </v-col>
      <!-- Epochs -->
      <v-col cols="12">
        <v-row>
          <v-col cols="3">
            Start Epoch
          </v-col>
          <v-col cols="9">
            <EpochField
              :epoch="item.startEpoch"
              default-text="-"
            />
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="12">
        <v-row>
          <v-col cols="3">
            End Epoch
          </v-col>
          <v-col cols="9">
            <EpochField
              :epoch="item.endEpoch"
              default-text="-"
            />
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="12">
        <v-row>
          <v-col cols="3">
            Duration
          </v-col>
          <v-col cols="9">
            {{ item.startEpoch && item.endEpoch
              ? `${(item.endEpoch - item.startEpoch) / 2880 } days`
              : '-' }}
          </v-col>
        </v-row>
      </v-col>
      <!-- Additional Info -->
      <v-col cols="12">
        <v-row>
          <v-col cols="3">
            Client Peer ID
          </v-col>
          <v-col cols="9">
            {{ item.clientPeerId || '-' }}
            <CopyIcon :value="item.clientPeerId" />
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="12">
        <v-row>
          <v-col cols="3">
            Created At
          </v-col>
          <v-col cols="9">
            {{ getRelativeTime(item.createdAt, 'long') }}
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="12">
        <v-row>
          <v-col cols="3">
            Signed Proposal CID
          </v-col>
          <v-col cols="9">
            {{ item.signedProposalCid || '-' }}
            <CopyIcon :value="item.signedProposalCid" />
          </v-col>
        </v-row>
      </v-col>
      <!-- Properties -->
      <v-col cols="12">
        <v-row>
          <v-col cols="3">
            Properties
          </v-col>
          <v-col cols="9">
            <v-chip
              v-for="(propValue, propKey) in dealProperties"
              :key="propKey"
              :color="propValue ? 'primary' : undefined"
              variant="flat"
              class="ma-1"
            >
              {{ propKey }}: {{ propValue }}
            </v-chip>
          </v-col>
        </v-row>
      </v-col>
      <!-- Error -->
      <v-col
        v-if="item.error"
        cols="12"
      >
        <v-row>
          <v-col cols="3">
            Error
          </v-col>
          <v-col cols="9">
            <v-alert
              type="error"
              variant="tonal"
              class="mb-0"
            >
              {{ item.error }}
            </v-alert>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </UiChildCard>
</template>
