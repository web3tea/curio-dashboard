import { defineStore } from 'pinia'
import { Alert } from '@/typed-graph'

interface LocalAlert {
  id: number
  message: string
  machineName: string
  timestamp: number
}

export const useAlertsStore = defineStore({
  id: 'alerts',
  state: () => ({
    alerts: [] as LocalAlert[],
    read: [] as number[],
  }),
  getters: {
    isAlertRead: state => (id: number) => state.read.includes(id),
    unreadAlerts: state => state.alerts.filter(alert => !state.read.includes(alert.id)),
    unreadAlertsCount: state => state.alerts.length - state.read.length,
  },
  actions: {
    markAsRead (id: number) {
      if (!this.read.includes(id)) {
        this.read.push(id)
      }
    },
    markAsUnread (id: number) {
      this.read = this.read.filter(readId => readId !== id)
    },
    markAllAsRead () {
      this.read = this.alerts.map(alert => alert.id)
    },
    appendAlert (alert: Alert) {
      if (!this.alerts.some(existingAlert => existingAlert.id === alert.id)) {
        this.alerts.unshift({
          id: alert.id,
          message: alert.message,
          machineName: alert.machineName,
          timestamp: new Date().getTime(),
        })
      }
    },
  },
})
