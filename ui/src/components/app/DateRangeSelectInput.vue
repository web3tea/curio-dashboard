<script setup lang="ts">
import { computed } from 'vue'

const emit = defineEmits(['update:dateRange'])

const props = defineProps({
  dateRange: {
    type: [Date],
    default: undefined,
  },
  label: {
    type: String,
    default: 'Date Range',
  },
})
const localValue = computed({
  get () {
    return props.dateRange
  },
  set (value) {
    emit('update:dateRange', value)
  },
})
</script>

<template>
  <v-date-input
    v-model="localValue"
    clearable
    color="primary"
    density="compact"
    :label="label"
    max-width="368"
    multiple="range"
    prepend-icon=""
    single-line
    variant="outlined"
  />
</template>

<style scoped lang="scss">

</style>
