<script setup lang="ts">
import { computed, watch } from 'vue'
import { useQuery } from "@vue/apollo-composable"

import { GetMiningCountAggregation } from "@/gql/mining"
import { useCustomizerStore } from "@/stores/customizer"
import { getError, getInfo, getSuccess } from "@/theme/UpdateColors"

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

const interval = computed(() => (props.end.getTime() - props.start.getTime()) >= 86400000 * 3 ? 'day' : 'hour')

const { result, refetch, error } = useQuery(GetMiningCountAggregation, {
  start: props.start,
  end: props.end,
  miner: props.miner,
  interval: interval.value,
}, () => ({
  fetchPolicy: 'cache-first'
})
)

watch([() => props.start, () => props.end, () => props.miner], () => {
  refetch({
    start: props.start,
    end: props.end,
    miner: props.miner,
    interval: interval.value,
  })
})

const items = computed(() => result.value?.miningCountAggregate || [])

const chartOptions = computed(() => {
  return {
    chart: {
      type: 'line',
      height: props.height,
      stacked: false,
      toolbar: false,
      zoom: {
        autoScaleYaxis: true,
      },
    },
    colors: [getSuccess.value,getError.value],
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
