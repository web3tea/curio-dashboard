<script setup lang="ts">
import { computed, ComputedRef, ref, watch } from 'vue'
import { getLightBorder } from '@/theme/ChartColors'
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { MetricsActiveTask } from '@/typed-graph'
import { useCustomizerStore } from '@/stores/customizer'

const customizer = useCustomizerStore()

const tab = ref(7)
watch(() => tab.value, () => {
  refetch({
    lastDays: tab.value,
    machine: null,
  })
})

const { result, refetch, error } = useQuery(gql`
query GetActiveTasksMetrics($lastDays: Int!, $machine: String) {
    metricsActiveTasks(lastDays: $lastDays, machine: $machine) {
        name
        series
    }
}
`, {
  lastDays: tab.value,
  machine: null,
}, () => ({
  fetchPolicy: 'cache-first',
}))
const items: ComputedRef<[MetricsActiveTask]> = computed(() => result.value?.metricsActiveTasks || [])

const chartOptions = computed(() => {
  return {
    chart: {
      type: 'area',
      height: 450,
      fontFamily: `inherit`,
      foreColor: '#a1aab2',
      toolbar: false,
      zoom: {
        autoScaleYaxis: true,
      },
    },
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
    },
  }
})

interface series {
  name: string
  data: number[][]
}

const areaChart = computed(() => {
  const series = [] as series[]
  items.value.forEach(item => {
    if (!item.series?.every(val => val[1] === 0)) {
      series.push({
        name: item.name,
        data: item.series as number[][],
      })
    }
  })
  return {
    series,
  }
})

</script>

<template>
  <v-card
    class="title-card"
    variant="text"
  >
    <v-card-item class="pb-2 px-0 pt-0">
      <div class="d-flex justify-space-between">
        <v-card-title class="text-h5">
          {{ $t('fields.Active Tasks') }}
        </v-card-title>
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
              value="7"
              variant="outlined"
            >
              {{ $t('fields.Week') }}
            </v-tab>
            <v-tab
              rounded="md"
              value="30"
              variant="outlined"
            >
              {{ $t('fields.Month') }}
            </v-tab>
          </v-tabs>
        </div>
      </div>
    </v-card-item>
    <v-card-text class="rounded-md overflow-hidden">
      <apexchart
        height="450"
        :options="chartOptions"
        :series="areaChart.series"
        type="area"
      />
    </v-card-text>
  </v-card>
</template>
