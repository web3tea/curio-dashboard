import { ref, watch, onMounted, Ref } from 'vue'

export function useLocalState<T>(key: string, defaultValue: T): Ref<T> {
  const state = ref<T>(defaultValue) as Ref<T>

  onMounted(() => {
    const savedState = localStorage.getItem(key)
    if (savedState) {
      try {
        state.value = JSON.parse(savedState)
      } catch (e) {
        console.error(`Error parsing saved state for ${key}:`, e)
        localStorage.removeItem(key)
      }
    }
  })

  watch(state, (newValue) => {
    localStorage.setItem(key, JSON.stringify(newValue))
  }, { deep: true })

  return state
}
