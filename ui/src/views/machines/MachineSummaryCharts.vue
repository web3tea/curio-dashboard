<script setup lang="ts">
import { computed, ComputedRef } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { GetMachinesSummary } from '@/gql/machine'
import { MachineSummary } from '@/typed-graph'
import { formatBytes } from '@/utils/helpers/formatBytes'
import { IconBrandSpeedtest, IconCpu, IconServer } from '@tabler/icons-vue'

const { result } = useQuery(GetMachinesSummary, null, () => ({
  fetchPolicy: 'cache-first',
  pollInterval: 600000,
}))

const stats: ComputedRef<MachineSummary> = computed(() => result.value?.machineSummary)

const cards = computed(() => [
  { value: stats.value?.total || 0, text: 'Machines', icon: IconServer, color: 'primary' },
  { value: stats.value?.totalCpu || 0, text: 'CPU', icon: IconCpu, color: 'info' },
  { value: stats.value?.totalGpu || 0, text: 'GPU', icon: IconCpu, color: 'success' },
  { value: formatBytes(stats.value?.totalRam || 0).combined, text: 'RAM', icon: IconBrandSpeedtest, color: 'warning' },
])

</script>
<template>
  <v-row>
    <v-col
      v-for="(card, i) in cards"
      :key="i"
      cols="12"
      md="3"
      :value="card"
    >
      <v-card elevation="0">
        <v-card variant="outlined">
          <v-card-text>
            <div class="d-flex align-items-center justify-space-between">
              <div>
                <h5 class="text-h5">{{ $t('fields.'+card.text) }}</h5>
                <h3 class="text-h3 my-2">{{ card.value }}</h3>
                <h6 class="text-caption font-weight-medium mb-0">{{ $d(new Date(), "short") }}</h6>
              </div>
              <span class="d-flex align-center">
                <v-btn
                  :color="card.color"
                  rounded="md"
                  variant="flat"
                >
                  <v-icon :icon="card.icon" />
                </v-btn>
              </span>
            </div>
          </v-card-text>
        </v-card>
      </v-card>
    </v-col>
  </v-row>
</template>
