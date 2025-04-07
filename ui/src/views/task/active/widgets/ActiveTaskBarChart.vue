<script setup lang="ts">
import { computed, ComputedRef } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { GetRunningTasks } from '@/gql/task'
import { Task } from '@/typed-graph'
import { useCustomizerStore } from '@/stores/customizer'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const customizer = useCustomizerStore()

const { result, loading } = useQuery(GetRunningTasks, null, () => ({
  fetchPolicy: 'cache-first',
  pollInterval: 3000,
}))

const items: ComputedRef<[Task]> = computed(() => result.value?.tasks || [])

const chart = computed(() => {
  // Group tasks by name and count them
  const taskCountMap = new Map<string, number>()

  // Count tasks by name
  items.value?.forEach((task) => {
    const taskName = task.name
    const currentCount = taskCountMap.get(taskName) || 0
    taskCountMap.set(taskName, currentCount + 1)
  })

  // Extract task names and counts
  const taskNames = Array.from(taskCountMap.keys())
  const taskCounts = Array.from(taskCountMap.values())

  return {
    series: [{
      name: t('runningTaskBarChart.seriesName'),
      data: taskCounts
    }],
    options: {
      chart: {
        type: 'bar'
      },
      theme: {
        mode: customizer.dark ? 'dark' : 'light',
      },
      noData: {
        text: loading ? t('cardCommon.loading'): t('cardCommon.noData'),
        align: 'center'
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          dataLabels: {
            position: 'top',
          },
        }
      },
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          return val
        },
        offsetY: -20,
      },
      xaxis: {
        categories: taskNames,
        position: 'bottom',
      },
      yaxis: {
        labels: {
          show: true,
          formatter: function (val) {
            return val
          }
        },
        title: {
          text: t('runningTaskBarChart.seriesName'),
        }
      },
      title: {
        text: t('runningTaskBarChart.title'),
        align: 'center',
      },
      tooltip: {
        enabled: false,
      },
      grid: {
        show: false
      }
    }
  }
})
</script>
<template>
  <v-card>
    <v-card-text>
      <apexchart
        height="350"
        :options="chart.options"
        :series="chart.series"
        type="bar"
      />
    </v-card-text>
  </v-card>
</template>
