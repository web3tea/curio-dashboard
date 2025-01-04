import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTableSettingsStore = defineStore("tableSettings", () => {
  const itemsPerPage = ref(100)
  const itemsPerPageOptions = ref([10, 50, 100, 500, 1000, 2000, 5000, 10000])
  const fixedHeader = ref(true)
  const hover = ref(true)

  return {
    itemsPerPage,
    itemsPerPageOptions,
    fixedHeader,
    hover,
  }
}, {
  persist: true,
})
