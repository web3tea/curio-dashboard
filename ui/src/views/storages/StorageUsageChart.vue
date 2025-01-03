<script setup lang="ts">
import { computed, ComputedRef } from 'vue'
import { CaretUpFilled } from '@ant-design/icons-vue'
import { useQuery } from '@vue/apollo-composable'
import { GetStorageStats } from '@/gql/storage'
import { useUIStore } from '@/stores/ui'
import { StorageStats } from '@/typed-graph'
import { formatBytes } from '@/utils/helpers/formatBytes'
import { getColorByType } from '@/utils/helpers/storageTypeColor'

const uiStore = useUIStore()

const { result, onError } = useQuery(GetStorageStats, null, () => ({
  fetchPolicy: 'cache-first',
}))

onError(error => {
  uiStore.appendMsg({
    type: 'error',
    msg: error.message,
  })
})

const items: ComputedRef<[StorageStats]> = computed(() => result.value?.storageStats || [])

const chartsData = computed(() => {
  if (!result.value) return []

  return items.value.map(stat => ({
    title: stat.type,
    color: getColorByType(stat.type),
    used: formatBytes(stat.totalCapacity - stat.totalAvailable).combined,
    available: formatBytes(stat.totalAvailable).combined,
    percentage: ((1 - stat.totalAvailable / stat.totalCapacity) * 100).toFixed(2) + '%',
    data: generateChartData(),
  }))
})

// todo: remove this function and use real data
function generateChartData (): number[] {
  return Array.from({ length: 7 }, () => Math.floor(Math.random() * 500))
}

// const chartsData = [
//   { title: 'Seal', color: '#52c41a', used: '10.23 TiB', available: '2.32 TiB', percentage: '70.5%', data: [200, 600, 100, 400, 300, 400, 50] },
//   { title: 'Store', color: '#faad14', used: '1021.23 TiB', available: '22.32 TiB', percentage: '17.4%', data: [100, 550, 300, 350, 245, 100, 300] },
//   { title: 'Hybrid', color: '#ff4d4f', used: '102.23 TiB', available: '33.32 TiB', percentage: '37.4%', data: [100, 550, 200, 300, 100, 200, 300] },
//   { title: 'Readonly', color: '#0848e8', used: '20.23 PiB', available: '201.32 TiB', percentage: '47.4%', data: [100, 550, 200, 300, 100, 300, 200] },
// ]

function getOption (title: string, color: string) {
  return {
    chart: {
      type: 'area',
      height: 80,
      width: 80,
      offsetY: 10,
      fontFamily: `inherit`,
      sparkline: {
        enabled: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    colors: [color],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0,
        stops: [0, 100],
      },
    },
    stroke: {
      curve: 'smooth',
      width: 1,
    },
    tooltip: {
      fixed: {
        enabled: false,
      },
      x: {
        show: false,
      },
      y: {
        title: {
          formatter: () => title + ' :',
        },
      },
    },
    responsive: [
      {
        breakpoint: 600,
        options: {
          chart: {
            width: '200',
          },
        },
      },
      {
        breakpoint: 960,
        options: {
          chart: {
            width: '400',
          },
        },
      },
      {
        breakpoint: 1280,
        options: {
          chart: {
            width: '100',
          },
        },
      },
      {
        breakpoint: 1400,
        options: {
          chart: {
            width: '60',
          },
        },
      },
      {
        breakpoint: 1600,
        options: {
          chart: {
            width: '100',
          },
        },
      },
    ],
  }
}
</script>
<template>
  <v-row>
    <template
      v-for="chart in chartsData"
      :key="chart.title"
    >
      <v-col
        cols="12"
        md="3"
      >
        <v-card
          class="bg-surface"
          variant="outlined"
        >
          <v-card-item>
            <div class="d-flex justify-space-between">
              <div>
                <h6 class="text-subtitle-1 mb-4">
                  {{ chart.title }}
                </h6>
                <h4 class="text-h4">
                  {{ chart.used }}
                </h4>
                <div class="d-flex">
                  <h6 class="mr-2 text-subtitle-1 mb-0">
                    {{ chart.available }}
                  </h6>
                  <p class="text-h6 text-lightText mb-0">
                    available
                  </p>
                </div>
              </div>
              <div>
                <div class="d-flex align-center justify-end">
                  <CaretUpFilled
                    class="text-success"
                    :style="{ fontSize: '12px' }"
                  />
                  <p class="text-h6 text-lightText mb-0 ml-2">
                    {{ chart.percentage }}
                  </p>
                </div>
                <apexchart
                  height="80"
                  :options="getOption(chart.title, chart.color)"
                  :series="[{
                    name: chart.title,
                    data: chart.data
                  }]"
                  type="area"
                  width="140"
                />
              </div>
            </div>
          </v-card-item>
        </v-card>
      </v-col>
    </template>
  </v-row>
</template>
