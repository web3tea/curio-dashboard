<script setup lang="ts">
import { computed, ComputedRef, ref, watch } from 'vue'
import { getLightBorder } from '@/theme/ChartColors'
import { useQuery } from '@vue/apollo-composable'
import { TaskAggregate } from '@/typed-graph'
import { useCustomizerStore } from '@/stores/customizer'
import { GetTaskHistoriesAggregation } from '@/views/query/task'
import { useTheme } from 'vuetify'

const theme = useTheme()
const InfoColor = theme.current.value.colors.info
const ErrorColor = theme.current.value.colors.error

const customizer = useCustomizerStore()

const tab = ref('7')
watch(() => tab.value, () => {
  const end = new Date()
  const start = new Date(end.getTime() - (Number(tab.value) * 24 * 60 * 60 * 1000))
  refetch({
    start,
    end,
    interval: tab.value === '7' ? 'hour' : 'day',
  })
})

const { result, refetch, error } = useQuery(GetTaskHistoriesAggregation, {
  start: new Date(new Date().getTime() - Number(tab.value) * 24 * 60 * 60 * 1000),
  end: new Date(),
  interval: 'hour',
}, () => ({
  fetchPolicy: 'cache-first',
}))
const items: ComputedRef<[TaskAggregate]> = computed(() => result.value?.taskHistoriesAggregate || [])

const chartOptions = computed(() => {
  return {
    chart: {
      type: 'area',
      height: 450,
      stacked: true,
      fontFamily: `inherit`,
      foreColor: '#a1aab2',
      toolbar: false,
      zoom: {
        autoScaleYaxis: true,
      },
    },
    colors: [InfoColor, ErrorColor],
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
    grid: {
      borderColor: getLightBorder.value,
    },
    xaxis: {
      type: 'datetime',
      axisBorder: {
        show: true,
        color: getLightBorder.value,
      },
      axisTicks: {
        color: getLightBorder.value,
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

interface series {
  name: string
  data: number[][]
}

const areaChart = computed(() => {
  const series = [] as series[]
  const success = {
    name: 'Success',
    data: [] as number[][],
  }
  const failure = {
    name: 'Failure',
    data: [] as number[][],
  }
  items.value.forEach(item => {
    success.data.push([new Date(item.time).getTime(), item.success])
    failure.data.push([new Date(item.time).getTime(), item.failure])
  })
  series.push(success, failure)
  return {
    series,
  }
})

</script>

<template>
  <v-card class="title-card" variant="text">
    <v-card-item class="pb-2 px-0 pt-0">
      <div class="d-flex justify-space-between">
        <v-card-title class="text-h5">Completed Tasks</v-card-title>
        <div class="d-flex flex-wrap">
          <v-tabs
            v-model="tab"
            class="tabBtn"
            color="primary"
            density="compact"
            hide-slider
          >
            <v-tab
              class="mr-1"
              rounded="md"
              size="small"
              value="7"
              variant="outlined"
            > Week </v-tab>
            <v-tab rounded="md" value="30" variant="outlined"> Month </v-tab>
          </v-tabs>
        </div>
      </div>
    </v-card-item>
    <v-card-text class="rounded-md overflow-hidden">
      <apexchart height="450" :options="chartOptions" :series="areaChart.series" type="area" />
    </v-card-text>
  </v-card>
</template>
