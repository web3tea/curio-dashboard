<script setup lang="ts">

import { useTheme } from 'vuetify'
import { Pipeline } from '@/typed-graph'
import { computed, PropType } from 'vue'

const theme = useTheme()

const props = defineProps({
  sector: {
    type: Object as PropType<Pipeline>,
    required: true,
  },
})

// todo: wait seed
const valueMap = {
  afterSdr: { value: 18, label: 'SDR' },
  afterTreeD: { value: 10, label: 'TreeD' },
  afterTreeC: { value: 5, label: 'TreeC' },
  afterTreeR: { value: 5, label: 'TreeR' },
  afterSynth: { value: 10, label: 'Synthetic' },
  afterPrecommitMsg: { value: 5, label: 'Precommit Msg' },
  afterPrecommitMsgSuccess: { value: 5, label: 'Precommit Wait' },
  afterPorep: { value: 15, label: 'PoRep' },
  afterFinalize: { value: 5, label: 'Clear Cache' },
  afterCommitMsg: { value: 5, label: 'Commit Msg' },
  afterMoveStorage: { value: 5, label: 'Move Storage' },
  afterCommitMsgSuccess: { value: 5, label: 'Commit Wait' },
}

const chartSeries = computed(() => [
  {
    data: Object.entries(valueMap).map(([key, value]) => ({
      x: value.label,
      y: (props.sector[key as keyof Pipeline] as boolean) ? value.value : -value.value,
    })),
  },
])

const chartOptions = computed(() => {
  return {
    legend: {
      show: false,
    },
    chart: {
      height: 100,
      type: 'treemap',
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      treemap: {
        enableShades: false,
        reverseNegativeShade: true,
        inverse: true,
        colorScale: {
          ranges: [
            {
              from: -100,
              to: 0,
              color: theme.current.value.colors.darksecondary,
            },
            {
              from: 1,
              to: 100,
              color: theme.current.value.colors.success,
            },
          ],
        },
      },
    },
    tooltip: {
      enabled: false,
    },
  }
})

</script>
<template>
  <apexchart height="100" :options="chartOptions" :series="chartSeries" type="treemap" />
</template>

<style scoped lang="scss">

</style>
