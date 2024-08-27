import { computed } from 'vue'
import { LightTheme } from '@/theme/LightTheme'
import { DarkTheme } from '@/theme/DarkTheme'
import { useCustomizerStore } from '@/stores/customizer'

const customizer = useCustomizerStore()

const getDarkPrimary = computed(() => {
  return DarkTheme.colors.primary
})

const getLightPrimary = computed(() => {
  return LightTheme.colors.primary200
})

const getLightBorder = computed(() => {
  if (customizer.dark) {
    return DarkTheme.colors.borderLight
  }
  return LightTheme.colors.borderLight
})

const getDarkSecondary = computed(() => {
  return DarkTheme.colors.secondary200
})

const getLightSecondary = computed(() => {
  return LightTheme.colors.secondary200
})

export { getDarkPrimary, getLightPrimary, getDarkSecondary, getLightSecondary, getLightBorder }
