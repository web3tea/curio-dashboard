<script setup lang="ts">
import { useQuery } from '@vue/apollo-composable'
import { computed, ComputedRef } from 'vue'
import { GetTaskNames } from '@/gql/task'

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  modelValue: {
    type: String,
    default: undefined,
  },
  label: {
    type: String,
    default: 'Task',
  },
})
const { result, loading } = useQuery(GetTaskNames, null, () => ({
  fetchPolicy: 'cache-first',
}))

const tasks: ComputedRef<[string]> = computed(() => result.value?.taskNames || [])

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
    :items="tasks"
    :label="props.label"
    variant="outlined"
  />
</template>

<style scoped lang="scss">

</style>
