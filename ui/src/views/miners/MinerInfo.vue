<script setup lang="ts">

import { useQuery } from '@vue/apollo-composable'
import { GetMinerFull } from '@/views/query/miner'
import { computed } from 'vue'
import UiChildCard from '@/components/shared/UiChildCard.vue'
import { formatBytes } from '@/utils/helpers/formatBytes'
import { formatFIL } from '@/utils/helpers/formatFIL'

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

const miner = result.value?.miner
const info = miner?.info
const power = miner?.power
const balance = miner?.balance

const cols1 = computed(() => {
  return [
    { title: 'ID', subtext: miner?.id, cols: 12, sm: 6 },
    { title: 'Owner', subtext: info?.owner, cols: 12, sm: 6 },
    { title: 'Worker', subtext: info?.worker, cols: 12, sm: 6 },
    { title: 'Beneficiary', subtext: info?.beneficiary, cols: 12, sm: 6 },
    { title: 'Sector Size', subtext: formatBytes(info?.sectorSize).combined, cols: 12, sm: 6 },
    { title: 'Window PoSt Proof Type', subtext: info?.windowPoStProofType, cols: 12, sm: 6 },
    { title: 'Control Addresses', subtext: info?.controlAddresses, cols: 12, sm: 12 },
    { title: 'Peer ID', subtext: info?.peerId, cols: 12, sm: 12 },
    { title: 'Multi Addrs', subtext: info?.multiAddrs, cols: 12, sm: 12 },
  ]
})

const cols2 = computed(() => {
  return [
    {
      title: 'Raw Byte Power',
      subtext: formatBytes(power?.rawBytePower).combined + ' / ' + (power?.rawBytePower | 0 / power?.totalPower?.rawBytePower).toFixed(2) + '%',
      cols: 12,
      sm: 6,
    },
    {
      title: 'Quality Adjusted Power',
      subtext: formatBytes(power?.qualityAdjPower).combined + ' / ' + (power?.qualityAdjPower | 0 / power?.totalPower?.qualityAdjPower).toFixed(2) + '%',
      cols: 12,
      sm: 6,
    },
    { title: 'Balance', subtext: formatFIL(balance?.balance), cols: 12, sm: 6 },
    { title: 'Initial Pledge', subtext: formatFIL(balance?.initialPledge), cols: 12, sm: 6 },
    { title: 'Pre Commit Deposits', subtext: formatFIL(balance?.preCommitDeposits), cols: 12, sm: 6 },
    { title: 'Vesting', subtext: formatFIL(balance?.vesting), cols: 12, sm: 6 },
    { title: 'Available', subtext: formatFIL(balance?.available), cols: 12, sm: 6 },
  ]
})
</script>

<template>
  <UiChildCard :loading="loading" title="Basic Info">
    <template #action>
      <v-btn round :rounded="true" variant="text" @click="refetch">
        <ReloadIcon />
      </v-btn>
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
