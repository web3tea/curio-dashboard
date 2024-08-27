import { computed } from 'vue'
import { LightTheme } from '@/theme/LightTheme'
import { DarkTheme } from '@/theme/DarkTheme'
import { useCustomizerStore } from '@/stores/customizer'

const cus = useCustomizerStore()

const getPrimary = computed(() => {
  if (cus.dark) {
    return DarkTheme.colors.primary
  } else {
    return LightTheme.colors.primary200
  }
})

const getBorder = computed(() => {
  if (cus.dark) {
    return DarkTheme.colors.borderLight
  } else {
    return LightTheme.colors.borderLight
  }
})

const getSecondary = computed(() => {
  if (cus.dark) {
    return DarkTheme.colors.secondary
  } else {
    return LightTheme.colors.secondary200
  }
})

export { getPrimary, getSecondary, getBorder }
