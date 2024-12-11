<script setup lang="ts">
import { useQuery } from '@vue/apollo-composable'
import { computed, ComputedRef } from 'vue'
import { Actor } from '@/typed-graph'
import { GetActorAddresses } from '@/gql/actor'

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  modelValue: {
    type: String,
    default: undefined,
  },
  label: {
    type: String,
    default: 'Miner',
  },
})

const { result, loading } = useQuery(GetActorAddresses, null, () => ({
  fetchPolicy: 'cache-first',
}))

const miners: ComputedRef<[Actor]> = computed(() => result.value?.actors || [])

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
    item-title="address"
    :items="miners"
    :label="props.label"
    variant="outlined"
  />
</template>

<style scoped lang="scss">

</style>
