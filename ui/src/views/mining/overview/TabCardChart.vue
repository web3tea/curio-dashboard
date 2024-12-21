<script setup lang="ts">
import { computed } from 'vue'
import { useQuery } from "@vue/apollo-composable"

import { GetMiningCountAggregation } from "@/gql/mining"
import { useCustomizerStore } from "@/stores/customizer"
import { getInfo, getPrimary, getSecondary } from "@/theme/UpdateColors"

const customizer = useCustomizerStore()

const props = defineProps({
  start: {
    type: Date,
    default: new Date(new Date().setDate(new Date().getDate() - 1))
  },
  end: {
    type: Date,
    default: new Date()
  },
  miner: {
    type: String,
    default: undefined
  },
  height: {
    type: Number,
    default: 275
  }
})

const { result, error } = useQuery(GetMiningCountAggregation, {
  start: props.start,
  end: props.end,
  miner: props.miner,
  interval: 'hour',
}, () => ({
  fetchPolicy: 'cache-first'
})
)

const items = computed(() => result.value?.miningCountAggregate || [])

const chartOptions = computed(() => {
  return {
    chart: {
      type: 'line',
      height: props.height,
      stacked: false,
      fontFamily: `inherit`,
      foreColor: '#a1aab2',
      toolbar: false,
      zoom: {
        autoScaleYaxis: true,
      },
    },
    colors: [getPrimary.value, getInfo.value, getSecondary.value],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    noData: {
      text: error.value?.message || 'Loading...',
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.4,
        stops: [0, 100],
      },
    },
    xaxis: {
      type: 'datetime',
      axisBorder: {
        show: true,
        color: getInfo.value,
      },
      axisTicks: {
        color: getInfo.value,
      },
    },
    legend: {
      show: true,
    },
    tooltip: {
      theme: customizer.dark ? 'dark' : 'light',
      x: {
        format: 'dd/MMM HH:mm',
      },
    },
  }
})

const chartData = computed(() => ({
  series: [
    {
      name: 'Won',
      data: items.value.map((item: { time: string, won: number }) => [new Date(item.time).getTime(), item.won])
    },
    {
      name: 'Valid Block',
      data: items.value.map((item: { time: string, included: number }) => [new Date(item.time).getTime(), item.included])
    },
    {
      name: 'Orphan Block',
      data: items.value.map((item: { time: string, won: number, included: number }) => [new Date(item.time).getTime(), item.won - item.included])
    }
  ]
}))

</script>

<template>
  <apexchart type="line" :height="props.height" :options="chartOptions" :series="chartData.series"> </apexchart>
</template>
