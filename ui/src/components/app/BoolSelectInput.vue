<script setup lang="ts">
import { computed } from 'vue'

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: undefined,
  },
  label: {
    type: String,
    default: 'Result',
  },
})

const localValue = computed({
  get () {
    return props.modelValue
  },
  set (value) {
    emit('update:modelValue', value)
  },
})

const items = [{ title: 'true', value: true }, { title: 'false', value: false }]

</script>

<template>
  <v-autocomplete
    v-model="localValue"
    clearable
    color="primary"
    density="compact"
    :items="items"
    :label="props.label"
    role="link"
    single-line
    variant="outlined"
  />
</template>

<style scoped lang="scss">

</style>
