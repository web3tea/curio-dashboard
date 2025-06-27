<script setup lang="ts">
import { computed, ComputedRef, ref, watch, onActivated, nextTick } from 'vue'
import { getLightBorder } from '@/theme/ChartColors'
import { useQuery } from '@vue/apollo-composable'
import { TaskAggregate } from '@/typed-graph'
import { useCustomizerStore } from '@/stores/customizer'
import { GetTaskHistoriesAggregation } from '@/gql/task'
import { useTheme } from 'vuetify'
import UiWidgetCard from '@/components/shared/UiWidgetCard.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const theme = useTheme()
const InfoColor = theme.current.value.colors.info
const ErrorColor = theme.current.value.colors.error

const customizer = useCustomizerStore()

const tab = ref('7')
const chartKey = ref(0)

// Extract time range calculation logic
const getTimeRange = () => {
  const end = new Date()
  const start = new Date(end.getTime() - (Number(tab.value) * 24 * 60 * 60 * 1000))
  return { start, end }
}

const { result, loading, refetch, error } = useQuery(GetTaskHistoriesAggregation, {
  start: new Date(new Date().getTime() - Number(tab.value) * 24 * 60 * 60 * 1000),
  end: new Date(),
  interval: 'hour',
}, () => ({
  fetchPolicy: 'cache-and-network',
}))

// Extract data fetching logic
const fetchData = () => {
  const { start, end } = getTimeRange()
  refetch({
    start,
    end,
    interval: tab.value === '7' ? 'hour' : 'day',
  })
}

watch(() => tab.value, fetchData)

onActivated(() => {
  // Force chart re-render
  nextTick(() => {
    chartKey.value++
  })
})

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
  <UiWidgetCard
    :loading="loading"
    :title="t('fields.Tasks Completed')"
  >
    <template #subtitle>
      <router-link :to="{name: 'TaskHistory'}">
        {{ t('fields.View All') }}
      </router-link>
    </template>
    <template #append>
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
          >
            {{ t('fields.Week') }}
          </v-tab>
          <v-tab
            rounded="md"
            value="30"
            variant="outlined"
          >
            {{ t('fields.Month') }}
          </v-tab>
        </v-tabs>
      </div>
    </template>
    <apexchart
      :key="chartKey"
      height="450"
      :options="chartOptions"
      :series="areaChart.series"
      type="area"
    />
  </UiWidgetCard>
</template>
