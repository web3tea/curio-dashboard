// Utilities
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    feature: {
      metrics: false,
    },
  }),
  actions: {
  },
})
