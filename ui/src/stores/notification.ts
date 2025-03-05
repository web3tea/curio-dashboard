import { defineStore } from "pinia"
import { ref } from "vue"

interface Message {
  text: string
  color?: string
  timeout?: number
  location?: 'top' | 'bottom'
}

const defaultMsg: Omit<Required<Message>, 'text'> = {
  color: 'info',
  timeout: 3000,
  location: 'top'
}

export const useNotificationStore = defineStore('notification', () => {
  const queue = ref<Message[]>([])

  function notify (msg: Message) {
    queue.value.push({ ...defaultMsg, ...msg })
  }

  function success(text: string, options: Omit<Message, 'text' | 'color'> = {}) {
    notify({
      text,
      color: 'success',
      ...options
    })
  }

  function error(text: string, options: Omit<Message, 'text' | 'color'> = {}) {
    notify({
      text,
      color: 'error',
      ...options
    })
  }

  function warning(text: string, options: Omit<Message, 'text' | 'color'> = {}) {
    notify({
      text,
      color: 'warning',
      ...options
    })
  }

  function info(text: string, options: Omit<Message, 'text' | 'color'> = {}) {
    notify({
      text,
      color: 'info',
      ...options
    })
  }

  return {
    queue,
    notify,
    success,
    error,
    warning,
    info
  }
})
