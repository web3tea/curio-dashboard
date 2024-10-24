import { ref } from 'vue'
import { defineStore } from 'pinia'

interface SnackMsg {
  type: string
  msg: string
}

export const useUIStore = defineStore('ui', () => {
  const isLoading = ref(false)
  const isOnline = ref(false)
  const showSnackbar = ref(false)
  const snackbarMsg = ref<SnackMsg>()

  function appendMsg (msg: SnackMsg) {
    snackbarMsg.value = msg
    showSnackbar.value = true
  }

  return {
    isLoading,
    isOnline,
    showSnackbar,
    snackbarMsg,
    appendMsg,
  }
})
