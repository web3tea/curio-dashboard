<script setup lang="ts">
import { useQuery } from '@vue/apollo-composable'
import { computed } from 'vue'
import { GetMachinesBase } from '@/gql/machine'

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  modelValue: {
    type: Number,
    default: undefined,
  },
  label: {
    type: String,
    default: 'Machine',
  },
  clearable: {
    type: Boolean,
    default: true,
  },
})

const { result, loading } = useQuery(GetMachinesBase, null, () => ({
  fetchPolicy: 'cache-first',
}))

const machines = computed(() => result.value?.machines || [])

const localValue = computed({
  get () {
    return props.modelValue
  },
  set (value) {
    emit('update:modelValue', value)
  },
})

</script>

<template>
  <v-autocomplete
    v-model="localValue"
    :clearable="props.clearable"
    color="primary"
    density="compact"
    :disabled="loading"
    item-title="hostAndPort"
    item-value="id"
    :items="machines"
    :label="props.label"
    variant="outlined"
  />
</template>

<style scoped lang="scss">

</style>