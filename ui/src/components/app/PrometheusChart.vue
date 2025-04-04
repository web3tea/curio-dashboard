<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { ApexOptions } from 'apexcharts'
import { PrometheusQueryRange } from '@/gql/prometheus'
import { useI18n } from 'vue-i18n'
import { formatBytes } from '@/utils/helpers/formatBytes'

const { t } = useI18n()

type PrometheusValuePair = [number, string]

type PrometheusMetric = Record<string, string>

interface PrometheusMatrixResult {
  metric: PrometheusMetric;
  values: PrometheusValuePair[];
}

interface PrometheusVectorResult {
  metric: PrometheusMetric;
  value: PrometheusValuePair;
}

interface PrometheusResponse {
  resultType: "matrix" | "vector" | "scalar" | "string";
  result: PrometheusMatrixResult[] | PrometheusVectorResult[];
}

interface PrometheusQueryRangeResponse {
  prometheusQueryRange: {
    data: PrometheusResponse;
  };
}

interface ApexChartSeries {
  name: string;
  data: {
    x: number;
    y: number;
  }[];
}

type ChartType = 'line' | 'area' | 'bar' | 'pie' | 'donut' | 'scatter' | 'bubble' | 'heatmap'
type YAxisType = 'default' | 'percent' | 'bytes' | 'bytesPerSecond' | 'time' | 'decimal' | 'integer'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  query: {
    type: String,
    required: true
  },
  chartType: {
    type: String as () => ChartType,
    default: 'line'
  },
  timeRange: {
    type: Number,
    default: 3600 // default to 1 hour
  },
  step: {
    type: Number,
    default: 0 // 0 means auto step
  },
  yAxisType: {
    type: String as () => YAxisType,
    default: 'default'
  },
  stacked: {
    type: Boolean,
    default: false
  },
  metricName: { // metrics name to display
    type: String,
    default: ''
  },
  height: {
    type: Number,
    default: 400
  },
  cardHeight: {
    type: Number,
    default: 0 // 0 means auto height
  },
  enableTimeRangeControl: {
    type: Boolean,
    default: true
  },
  enableRefresh: {
    type: Boolean,
    default: true
  },
  enableActions: {
    type: Boolean,
    default: true
  },
  autoRefresh: {
    type: Number,
    default: 0 // 0 means no auto refresh, otherwise refresh interval (ms)
  },
  showQueryByDefault: {
    type: Boolean,
    default: false
  },
  themeColors: {
    type: Array as () => string[],
    default: () => ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0', '#546E7A', '#26a69a', '#D10CE8']
  }
})

const emit = defineEmits(['data-loaded', 'error', 'time-range-changed'])

const showQuery = ref(props.showQueryByDefault)

const chartHeight = computed(() => props.height)

const timeRangeOptions = [
  { label: t('prometheus.last30min'), value: 30 * 60 },
  { label: t('prometheus.last1hour'), value: 60 * 60 },
  { label: t('prometheus.last6hour'), value: 6 * 60 * 60 },
  { label: t('prometheus.last12hour'), value: 12 * 60 * 60 },
  { label: t('prometheus.last24hour'), value: 12 * 60 * 60 },
  { label: t('prometheus.last7day'), value: 7 * 24 * 60 * 60 },
  { label: t('prometheus.last30day'), value: 30 * 24 * 60 * 60 },
]

const formatters = {
  default: (value: number) => value.toFixed(2),
  percent: (value: number) => value.toFixed(2) + '%',
  bytes: (bytes: number, decimals = 2): string => {
    return formatBytes(bytes, decimals).combined
  },
  bytesPerSecond: (bytes: number, decimals = 2): string => {
    return formatters.bytes(bytes, decimals) + '/s'
  },
  time: (seconds: number, decimals = 2): string => {
    if (seconds === 0) return '0 sec'
    if (seconds < 1) {
      return (seconds * 1000).toFixed(decimals) + ' ms'
    } else if (seconds < 60) {
      return seconds.toFixed(decimals) + ' sec'
    } else if (seconds < 3600) {
      return (seconds / 60).toFixed(decimals) + ' min'
    } else if (seconds < 86400) {
      return (seconds / 3600).toFixed(decimals) + ' h'
    } else {
      return (seconds / 86400).toFixed(decimals) + ' d'
    }
  },
  decimal: (value: number) => value.toFixed(2),
  integer: (value: number) => Math.round(value).toString()
}

const yAxisFormatter = computed(() => {
  return formatters[props.yAxisType as keyof typeof formatters] || formatters.default
})

const { result, loading, error, refetch } = useQuery<PrometheusQueryRangeResponse>(
  PrometheusQueryRange,
  {
    query: props.query,
    start: new Date(Date.now() - props.timeRange * 1000).toISOString(),
    end: new Date().toISOString(),
    step: props.step || Math.max(Math.floor(props.timeRange / 100), 15)
  },
  {
    fetchPolicy: 'cache-and-network',
    pollInterval: props.autoRefresh > 0 ? props.autoRefresh : 0
  }
)

const prometheusData = computed(() => {
  if (result.value?.prometheusQueryRange?.data) {
    return result.value.prometheusQueryRange.data
  }
  return null
})

const series = computed<ApexChartSeries[]>(() => {
  if (!prometheusData.value || prometheusData.value.resultType !== "matrix") {
    return []
  }
  const matrixResults = prometheusData.value.result as PrometheusMatrixResult[]

  const seriesData = matrixResults
    .map(item => {
      let metricName = ''
      if (props.metricName !== '') {
        metricName = item.metric[props.metricName] || ''
      } else {
        metricName = Object.entries(item.metric)
          .map(([key, value]) => `${key}="${value}"`)
          .join(', ')
      }

      const points = item.values.map(([timestamp, value]) => ({
        x: timestamp * 1000, // turn timestamp into milliseconds
        y: parseFloat(value)
      }))

      return {
        name: metricName || "Series",
        data: points,
        // check if all y values are 0
        allZeros: points.every(point => point.y === 0)
      }
    })
    // skip series with all y values 0
    .filter(series => !series.allZeros)
    .map(({ name, data }) => ({ name, data }))

  if (seriesData.length > 0) {
    emit('data-loaded', seriesData)
  }

  return seriesData
})

watch(series, (newSeries) => {
  console.log('Series data updated:', newSeries)
})

// ApexCharts options
const chartOptions = computed((): ApexOptions => {
  return {
    chart: {
      id: `prometheus-chart-${Math.random().toString(36).substring(2, 9)}`,
      type: props.chartType,
      animations: {
        enabled: false
      },
      toolbar: {
        show: false,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true
        }
      },
      zoom: {
        enabled: true
      },
      stacked: props.stacked
    },
    colors: props.themeColors,
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    xaxis: {
      type: 'datetime',
      labels: {
        datetimeUTC: false
      }
    },
    yaxis: {
      labels: {
        formatter: (value: number) => yAxisFormatter.value(value)
      }
    },
    tooltip: {
      x: {
        format: 'yyyy-MM-dd HH:mm:ss'
      },
      y: {
        formatter: (value: number) => yAxisFormatter.value(value)
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      offsetY: -15,
      height: 40
    }
  }
})

const updateTimeRange = (newRange: number) => {
  emit('time-range-changed', newRange)
}
</script>

<template>
  <v-card
    :loading="loading"
    :height="cardHeight"
    class="prometheus-chart"
  >
    <template #loader="{ isActive }">
      <v-progress-linear
        :active="isActive"
        color="primary"
        indeterminate
      />
    </template>

    <v-card-item>
      <v-card-title>{{ title }}</v-card-title>
      <v-card-subtitle v-if="subtitle">
        {{ subtitle }}
      </v-card-subtitle>

      <template #append>
        <v-menu v-if="enableTimeRangeControl">
          <template #activator="{ props:pp }">
            <v-btn
              variant="text"
              icon="mdi-clock-outline"
              size="small"
              v-bind="pp"
            />
          </template>
          <v-list>
            <v-list-item
              v-for="option in timeRangeOptions"
              :key="option.value"
              :title="option.label"
              @click="updateTimeRange(option.value)"
            />
          </v-list>
        </v-menu>
        <v-btn
          v-if="enableRefresh"
          variant="text"
          icon="mdi-refresh"
          size="small"
          :disabled="loading"
          @click="refetch"
        />
      </template>
    </v-card-item>

    <v-card-text>
      <div
        v-if="error"
        class="text-center py-4 text-error"
      >
        <v-icon
          icon="mdi-alert-circle"
          class="me-2"
        />
        {{ error.message }}
      </div>
      <div
        v-else-if="loading && !series.length"
        class="d-flex justify-center align-center"
        style="height: 300px"
      >
        <v-progress-circular indeterminate />
      </div>
      <div
        v-else-if="!series.length"
        class="d-flex flex-column justify-center align-center"
        style="height: 300px"
      >
        <v-icon
          icon="mdi-chart-bell-curve"
          size="large"
          class="mb-2 text-disabled"
        />
        <span class="text-disabled"> No Data </span>
      </div>
      <div
        v-else
        :style="{ height: `${chartHeight}px` }"
      >
        <apexchart
          :type="chartType"
          :options="chartOptions"
          :series="series"
          :height="chartHeight"
        />
      </div>

      <div
        v-if="showQuery"
        class="mt-2 text-caption text-disabled"
      >
        <code>{{ query }}</code>
      </div>
    </v-card-text>

    <v-card-actions v-if="enableActions">
      <v-spacer />
      <v-btn
        v-if="showQuery"
        size="small"
        variant="text"
        @click="showQuery = false"
      >
        Hidden Query
      </v-btn>
      <v-btn
        v-else
        size="small"
        variant="text"
        @click="showQuery = true"
      >
        Show Query
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
.prometheus-chart {
  position: relative;
}

:deep(.apexcharts-tooltip) {
  background: var(--v-theme-surface);
  color: var(--v-theme-on-surface);
  border-color: rgba(var(--v-border-color), var(--v-border-opacity));
}

@media (max-width: 600px) {
  :deep(.apexcharts-legend-series) {
    margin: 2px 5px;
  }

  :deep(.apexcharts-toolbar) {
    z-index: 5;
  }
}
</style>
