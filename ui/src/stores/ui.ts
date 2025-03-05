import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUIStore = defineStore('ui', () => {
  const isLoading = ref(false)
  const isOnline = ref(false)

  return {
    isLoading,
    isOnline,
  }
})
