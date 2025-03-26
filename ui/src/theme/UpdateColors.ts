import { computed } from 'vue'
import { LightTheme } from '@/theme/LightTheme'
import { DarkTheme } from '@/theme/DarkTheme'
import { useCustomizerStore } from '@/stores/customizer'

const cus = useCustomizerStore()

const getPrimary = computed(() => {
  if (cus.dark) {
    return DarkTheme.colors?.primary
  } else {
    return LightTheme.colors?.primary200
  }
})

const getInfo = computed(() => {
  if (cus.dark) {
    return DarkTheme.colors?.info
  } else {
    return LightTheme.colors?.info
  }
})

const getWarning = computed(() => {
  if (cus.dark) {
    return DarkTheme.colors?.warning
  } else {
    return LightTheme.colors?.warning
  }
})

const getBorder = computed(() => {
  if (cus.dark) {
    return DarkTheme.colors?.borderLight
  } else {
    return LightTheme.colors?.borderLight
  }
})

const getError = computed(() => {
  if (cus.dark) {
    return DarkTheme.colors?.error
  } else {
    return LightTheme.colors?.error
  }
})

const getSuccess = computed(() => {
  if (cus.dark) {
    return DarkTheme.colors?.success
  } else {
    return LightTheme.colors?.success
  }
})

const getSecondary = computed(() => {
  if (cus.dark) {
    return DarkTheme.colors?.secondary
  } else {
    return LightTheme.colors?.secondary200
  }
})

export { getPrimary, getSecondary, getBorder, getInfo, getWarning, getSuccess, getError }
