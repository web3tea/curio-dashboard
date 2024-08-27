<script setup lang="ts">
import { computed, ComputedRef } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { GetMachinesSummary } from '@/views/query/machine'
import { MachineSummary } from '@/typed-graph'
import { formatBytes } from '@/utils/helpers/formatBytes'
import moment from 'moment'
import { mdiExpansionCard } from '@mdi/js'
import { BrandSpeedtestIcon, CpuIcon, ServerIcon } from 'vue-tabler-icons'

const { result } = useQuery(GetMachinesSummary, null, () => ({
  fetchPolicy: 'cache-first',
  pollInterval: 600000,
}))

const stats: ComputedRef<MachineSummary> = computed(() => result.value?.machineSummary)

const cards = computed(() => [
  { value: stats.value?.total || 0, text: 'Machine', icon: ServerIcon, color: 'primary', duedate: moment().calendar() },
  { value: stats.value?.totalCpu || 0, text: 'CPU', icon: CpuIcon, color: 'info', duedate: moment().calendar() },
  { value: stats.value?.totalGpu || 0, text: 'GPU', icon: mdiExpansionCard, color: 'success', duedate: moment().calendar() },
  { value: formatBytes(stats.value?.totalRam || 0).combined, text: 'RAM', icon: BrandSpeedtestIcon, color: 'warning', duedate: moment().calendar() },
])

</script>
<template>
  <v-row>
    <v-col
      v-for="(card4, i) in cards"
      :key="i"
      cols="12"
      md="3"
      :value="card4"
    >
      <v-card elevation="0">
        <v-card variant="outlined">
          <v-card-text>
            <div class="d-flex align-items-center justify-space-between">
              <div>
                <h5 class="text-h5">{{ card4.text }}</h5>
                <h3 class="text-h3 my-2">{{ card4.value }}</h3>
                <h6 class="text-caption font-weight-medium mb-0">{{ card4.duedate }}</h6>
              </div>
              <span class="d-flex align-center">
                <v-btn
                  :color="card4.color"
                  rounded="md"
                  variant="flat"
                >
                  <v-icon :icon="card4.icon" />
                </v-btn>
              </span>
            </div>
          </v-card-text>
        </v-card>
      </v-card>
    </v-col>
  </v-row>
</template>
