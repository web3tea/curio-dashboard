<script setup lang="ts">
import { computed } from 'vue'
import { useTheme } from 'vuetify'
import { getSecondary } from "@/theme/UpdateColors"

const theme = useTheme()
const warningColor = theme.current.value.colors.warning
const chartOptions = computed(() => {
  return {
    chart: {
      type: 'line',
      stacked: false,
      height: 255,
      fontFamily: `inherit`,
      foreColor: getSecondary.value,
      toolbar: {
        show: false
      }
    },
    colors: [warningColor, warningColor],
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: [0, 3]
    },
    plotOptions: {
      bar: {
        columnWidth: '50%'
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        inverseColors: false,
        shade: 'light',
        type: 'vertical',
        opacityFrom: [0, 1],
        opacityTo: [0.35, 1],
        stops: [0, 100],
        hover: {
          inverseColors: false,
          shade: 'light',
          type: 'vertical',
          opacityFrom: 0.15,
          opacityTo: 0.65,
          stops: [0, 96, 100]
        }
      }
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    legend: {
      show: false
    },
    grid: {
      borderColor: 'rgba(0,0,0,0.1)'
    },
    markers: {
      size: [0, 4],
      colors: '#fff',
      strokeWidth: [0, 2],
      strokeColors: warningColor,
      hover: {
        size: 8,
        colors: warningColor,
        strokeColors: '#fff'
      }
    }
  }
})
const mixedChart = {
  series: [
    {
      name: 'TEAM A',
      type: 'column',
      data: [1, 2, 3, 5, 1, 0, 2, 0, 6, 1, 5, 3]
    },
    {
      name: 'TEAM B',
      type: 'line',
      data: [5, 3, 5, 6, 7, 0, 3, 1, 7, 3, 5, 4]
    }
  ]
}
</script>

<template>
  <!-- ---------------------------------------------------- -->
  <!-- Mixed Chart -->
  <!-- ---------------------------------------------------- -->

  <apexchart type="line" height="255" :options="chartOptions" :series="mixedChart.series"> </apexchart>
</template>
