<script setup lang="ts">

import UiChildCard from '@/components/shared/UiChildCard.vue'
import { useQuery } from '@vue/apollo-composable'
import { computed, ComputedRef } from 'vue'
import { StoragePath } from '@/typed-graph'
import { GetMachineStorages } from '@/views/query/machine'

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
})

const { result, loading, refetch, error } = useQuery(GetMachineStorages, {
  id: props.id,
}, () => ({
  fetchPolicy: 'cache-first',
}))

const paths: ComputedRef<[StoragePath]> = computed(() => result.value?.machine.storages || [])

</script>

<template>
  <UiChildCard :loading="loading" title="Storages ">
    <template #action>
      <v-btn round :rounded="true" variant="text" @click="refetch">
        <ReloadIcon />
      </v-btn>
    </template>
    <StoragePathTable :error="error" hide-footer :items="paths" :loading="loading" />
  </UiChildCard>
</template>

<style scoped lang="scss">

</style>
