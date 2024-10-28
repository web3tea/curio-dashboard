<script setup lang="ts">
import { computed, ComputedRef } from 'vue'
import { useTheme } from 'vuetify'
import UiTitleCard from '@/components/shared/UiTitleCard.vue'
import { useQuery } from '@vue/apollo-composable'
import { GetMiningSummary } from '@/views/query/mining'
import { MiningSummaryDay } from '@/typed-graph'
import { useCustomizerStore } from '@/stores/customizer'
import { IconReload } from '@tabler/icons-vue'

const theme = useTheme()
const InfoColor = theme.current.value.colors.info
const customizer = useCustomizerStore()

const end = new Date()
const start = new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000) // todo: props

const { result, refetch, loading, error } = useQuery(GetMiningSummary, {
  start,
  end,
}, () => ({
  fetchPolicy: 'cache-first',
}))

const items: ComputedRef<[MiningSummaryDay]> = computed(() => result.value?.miningSummaryByDay || [])

const chartOptions = computed(() => {
  return {
    chart: {
      type: 'bar',
      height: 370,
      stacked: true,
      fontFamily: `inherit`,
      foreColor: '#a1aab2',
      toolbar: {
        show: false,
      },
    },
    noData: {
      text: error.value?.message || 'Loading...',
    },
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      bar: {
        columnWidth: '45%',
        borderRadius: 4,
        dataLabels: {
          total: {
            enabled: true,
          },
        },
      },
    },
    colors: InfoColor,
    stroke: {
      curve: 'smooth',
    },
    fill: {
      opacity: 0.6,
    },
    xaxis: {
      type: 'datetime',
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      show: false,
    },
    grid: {
      show: false,
    },
    tooltip: {
      theme: customizer.dark ? 'dark' : 'light',
      fixed: {
        enabled: false,
      },
    },
  }
})

const chartSeries = computed(() => {
  const seriesMap: { [key: string]: number[][] } = {}

  items.value.forEach(item => {
    if (!seriesMap[item.miner]) {
      seriesMap[item.miner] = []
    }
    seriesMap[item.miner].push([item.day, item.wonBlock])
  })

  return Object.keys(seriesMap).length > 0
    ? Object.keys(seriesMap).map(miner => ({
      name: miner,
      data: seriesMap[miner],
    }))
    : [{
      name: 'No Data',
      data: Array.from({ length: 7 }, (_, i) => [new Date(start.getTime() + i * 24 * 60 * 60 * 1000).getTime(), 0]),
    }]
})

const totalWonBlocks = computed(() => {
  return chartSeries.value.reduce((total, series) => {
    return total + series.data.reduce((sum, [, wonBlock]) => sum + wonBlock, 0)
  }, 0)
})

</script>

<template>
  <UiTitleCard class-name="pt-5 px-0 rounded-md overflow-hidden" :title="$t('fields.Mining Overview')">
    <template #action>
      <v-btn
        :disabled="loading"
        :icon="IconReload"
        round
        :rounded="true"
        variant="text"
        @click="refetch"
      />
    </template>
    <div class="px-5">
      <h6 class="text-h6 text-lightText mb-4">{{ $t('msgs.weekBlock') }}</h6>
      <h3 class="text-h3 mb-0">{{ totalWonBlocks }}</h3>
    </div>
    <apexchart
      height="370"
      :loading="loading"
      :options="chartOptions"
      :series="chartSeries"
      type="bar"
    />
  </UiTitleCard>
</template>
