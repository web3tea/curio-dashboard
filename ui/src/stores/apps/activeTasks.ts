// Utilities
import { defineStore } from 'pinia'
import { fetchWrapper } from '@/utils/helpers/fetch-wrapper'

const url = new URL(`${import.meta.env.VITE_API_BASE_URL}/api/metrics/active-tasks`)

export const useActiveTaskStore = defineStore('active-tasks', {
  state: () => ({
    chartData: new Map<string, number[][]>(), // name: [[timestamp, value]]
    lastUpdated: new Date(),
    init: false,
  }),
  actions: {
    fetchData (lastDays: number): Map<string, number[][]> {
      const now = new Date()
      const start = new Date()
      start.setDate(now.getDate() - lastDays)

      const params = new URLSearchParams({ start: start.toISOString(), end: now.toISOString() })
      url.search = params.toString()
      fetchWrapper.get(url.toString()).then(data => {
        for (const item of data) {
          const data = [] as number[][]
          for (const series of item.series) {
            data.push(series)
          }
          this.chartData.set(item.name, data)
        }
        this.lastUpdated = new Date()
        this.init = true
      })
      return this.chartData
    },
  },
})
