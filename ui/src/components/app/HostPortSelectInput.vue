<script setup lang="ts">
import { useQuery } from '@vue/apollo-composable'
import { computed, ComputedRef } from 'vue'
import { Machine } from '@/typed-graph'
import { GetMachinesBase } from '@/gql/machine'

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  modelValue: {
    type: String,
    default: undefined,
  },
  label: {
    type: String,
    default: 'HostPort',
  },
})
const { result, loading } = useQuery(GetMachinesBase, null, () => ({
  fetchPolicy: 'cache-first',
}))

const machines: ComputedRef<[Machine]> = computed(() => result.value?.machines || [])

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
    clearable
    color="primary"
    density="compact"
    :disabled="loading"
    item-title="hostAndPort"
    :items="machines"
    :label="props.label"
    role="link"
    single-line
    variant="outlined"
  />
</template>

<style scoped lang="scss">

</style>
