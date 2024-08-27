import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import config from '@/config'

export const useCustomizerStore = defineStore({
  id: 'customizer',
  state: () => ({
    sidebarDrawer: useStorage('sidebarDrawer', config.sidebarDrawer),
    customizerDrawer: useStorage('customizerDrawer', config.customizerDrawer),
    miniSidebar: useStorage('miniSidebar', config.miniSidebar),
    horizontalLayout: useStorage('horizontalLayout', config.horizontalLayout),
    dark: useStorage('dark', config.dark),
  }),
  getters: {},
  actions: {
    setSidebarDrawer (value: boolean) {
      this.sidebarDrawer = value
    },
    setMiniSidebar (value: boolean) {
      this.miniSidebar = value
    },
    setCustomizerDrawer (value: boolean) {
      this.customizerDrawer = value
    },
    setHorizontalLayout (value: boolean) {
      this.horizontalLayout = value
    },
    setDark (value: boolean) {
      this.dark = value
    },
  },
})
