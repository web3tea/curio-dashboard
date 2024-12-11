<script setup lang="ts">

import { useQuery } from '@vue/apollo-composable'
import { GetMinerFull } from '@/gql/miner'
import { computed } from 'vue'
import UiChildCard from '@/components/shared/UiChildCard.vue'
import { formatBytes } from '@/utils/helpers/formatBytes'
import { formatFIL } from '@/utils/helpers/formatFIL'
import { IconReload } from '@tabler/icons-vue'
import { useI18n } from 'vue-i18n'


const { t } = useI18n()

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
})

const { result, loading, refetch, error } = useQuery(GetMinerFull, {
  address: props.id,
}, () => ({
  fetchPolicy: 'cache-first',
}))

const cols1 = computed(() => {
  const miner = result.value?.miner
  const info = miner?.info
  return [
    { title: t('fields.ID'), subtext: miner?.id, cols: 12, sm: 6 },
    { title: t('fields.Owner'), subtext: info?.owner, cols: 12, sm: 6 },
    { title: t('fields.Worker'), subtext: info?.worker, cols: 12, sm: 6 },
    { title: t('fields.Beneficiary'), subtext: info?.beneficiary, cols: 12, sm: 6 },
    { title: t('fields.Sector Size'), subtext: formatBytes(info?.sectorSize).combined, cols: 12, sm: 6 },
    { title: t('fields.Window PoSt Proof Type'), subtext: info?.windowPoStProofType, cols: 12, sm: 6 },
    { title: t('fields.Control Addresses'), subtext: info?.controlAddresses, cols: 12, sm: 12 },
    { title: t('fields.Peer ID'), subtext: info?.peerId, cols: 12, sm: 12 },
    { title: t('fields.Multi Addrs'), subtext: info?.multiAddrs, cols: 12, sm: 12 },
  ]
})

const cols2 = computed(() => {
  const miner = result.value?.miner
  const power = miner?.power
  const balance = miner?.balance
  return [
    {
      title: t('fields.Raw Byte Power'),
      subtext: formatBytes(power?.rawBytePower).combined + ' / ' + (power?.rawBytePower | 0 / power?.totalPower?.rawBytePower).toFixed(2) + '%',
      cols: 12,
      sm: 6,
    },
    {
      title: t('fields.Quality Adjusted Power'),
      subtext: formatBytes(power?.qualityAdjPower).combined + ' / ' + (power?.qualityAdjPower | 0 / power?.totalPower?.qualityAdjPower).toFixed(2) + '%',
      cols: 12,
      sm: 6,
    },
    { title: t('fields.Balance'), subtext: formatFIL(balance?.balance), cols: 12, sm: 6 },
    { title: t('fields.Initial Pledge'), subtext: formatFIL(balance?.initialPledge), cols: 12, sm: 6 },
    { title: t('fields.Pre Commit Deposits'), subtext: formatFIL(balance?.preCommitDeposits), cols: 12, sm: 6 },
    { title: t('fields.Vesting'), subtext: formatFIL(balance?.vesting), cols: 12, sm: 6 },
    { title: t('fields.Available Balance'), subtext: formatFIL(balance?.available), cols: 12, sm: 6 },
  ]
})
</script>

<template>
  <UiChildCard :loading="loading" :title="t('fields.Basic Info')">
    <template #action>
      <v-btn
        :icon="IconReload"
        rounded
        variant="text"
        @click="refetch"
      />
    </template>
    <v-row class="py-2 mx-0 details-content">
      <v-col cols="12" sm="6">
        <v-row>
          <v-col
            v-for="(detail, i) in cols1"
            :key="i"
            class="px-0 pb-0"
            :cols="detail.cols"
            :sm="detail.sm"
          >
            <p class="text-h6 text-lightText mb-1">{{ detail.title }}</p>
            <p class="text-h6 mb-2">
              <template v-if="Array.isArray(detail.subtext)">
                <v-chip v-for="(item, index) in detail.subtext" :key="index" class="mr-1">{{ item }}</v-chip>
                <v-chip v-if="!detail.subtext.length" class="mr-1">N/A</v-chip>
              </template>
              <template v-else>
                {{ detail.subtext || 'N/A' }}
              </template>
            </p>
            <v-divider />
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" sm="6">
        <v-row>
          <v-col
            v-for="(detail, i) in cols2"
            :key="i"
            class="px-0 pb-0"
            :cols="detail.cols"
            :sm="detail.sm"
          >
            <p class="text-h6 text-lightText mb-1">{{ detail.title }}</p>
            <p class="text-h6 mb-2">
              <template v-if="Array.isArray(detail.subtext)">
                <v-chip v-for="(item, index) in detail.subtext" :key="index" class="mr-1">{{ item }}</v-chip>
                <v-chip v-if="!detail.subtext.length" class="mr-1">N/A</v-chip>
              </template>
              <template v-else>
                {{ detail.subtext || 'N/A' }}
              </template>
            </p>
            <v-divider />
          </v-col>
        </v-row>
      </v-col>
      <v-col v-if="error">
        <p>{{ error }}</p>
      </v-col>
    </v-row>
  </uichildcard>
</template>

<style scoped lang="scss">

</style>
