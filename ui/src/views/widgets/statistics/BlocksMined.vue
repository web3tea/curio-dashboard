<script setup lang="ts">

import { computed, ComputedRef } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { GetMiningWinsCount } from '@/gql/mining'
import { IconCurrency } from '@tabler/icons-vue'

const props = defineProps({
  sp: {
    type: String,
    default: undefined
  },
  lastHours: {
    type: Number,
    default: 24,
  },
})

const currentEnd = new Date()
const currentStart = new Date(currentEnd.getTime() - props.lastHours * 60 * 60 * 1000)

const { result } = useQuery(GetMiningWinsCount, {
  miner: props.sp,
  end: currentEnd,
  start: currentStart,
}, {
  pollInterval: 1000,
})

const count: ComputedRef<number> = computed(() => result.value?.miningWinsCount || count.value || 0)

</script>

<template>
  <v-card elevation="0">
    <v-card variant="outlined">
      <v-card-text>
        <div class="d-flex align-items-center justify-space-between">
          <div>
            <h5 class="text-h5">{{ $t('fields.Blocks Mined') }}</h5>
            <h3 class="text-h3 my-2">{{ count }}</h3>
            <h6 class="text-caption font-weight-medium mb-0">
              {{ $d(currentStart, 'short') }} - {{ $d(currentEnd, 'short') }}
            </h6>
          </div>
          <span class="d-flex align-center">
            <v-btn
              :icon="IconCurrency"
              rounded="md"
              size="small"
              :to="{ name: 'MiningTaskList' }"
              variant="flat"
            />
          </span>
        </div>
      </v-card-text>
    </v-card>
  </v-card>
</template>

<style scoped lang="scss">

</style>
