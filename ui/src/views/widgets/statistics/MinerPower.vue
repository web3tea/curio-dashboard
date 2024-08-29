<script setup lang="ts">

import { GetMinerPower } from '@/views/query/miner'
import { computed } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { RiseOutlined } from '@ant-design/icons-vue'
import { MinerPower } from '@/typed-graph'
import { formatBytes } from '@/utils/helpers/formatBytes'

const props = defineProps({
  miner: {
    type: String,
  },
})

const { result } = useQuery(GetMinerPower, {
  miner: props.miner,
}, () => ({
  fetchPolicy: 'cache-first',
}))

const minerPower: ComputedRef<MinerPower> = computed(() => result.value?.minerPower || {})

const card = computed(() => ({
  name: 'Total QA Power',
  qaPower: minerPower.value?.minerPower?.qualityAdjPower,
  rawPower: minerPower.value?.minerPower?.rawBytePower,
  percent: ((minerPower.value?.minerPower?.qualityAdjPower / minerPower.value?.totalPower?.qualityAdjPower) * 100).toFixed(2),
  color: 'primary',
  icon: RiseOutlined,
  rate: '2.13 %', // TODO: get from API
}))

</script>

<template>
  <v-card elevation="0">
    <v-card variant="outlined">
      <v-card-text>
        <div class="d-flex align-items-center justify-space-between">
          <div>
            <h6 class="text-h6 text-lightText mb-1">{{ card.name }}</h6>
            <h4 class="text-h4 d-flex align-center mb-0">
              {{ formatBytes(card.qaPower).combined }}
              <v-chip
                :border="`${card.color} solid thin opacity-50`"
                class="ml-2"
                :color="card.color"
                label
                size="small"
              >
                <template #prepend>
                  <component :is="card.icon" :class="'mr-1 text-' + card.color" :style="{ fontSize: '12px' }" />
                </template>
                {{ card.rate }}
              </v-chip>
            </h4>
            <span class="text-lightText text-caption pt-5 d-block">You own <span :class="'text-' + card.color">{{ card.percent }}%</span> of the total network power.</span>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-card>
</template>

<style scoped lang="scss">

</style>
