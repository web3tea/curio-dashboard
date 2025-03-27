<script setup lang="ts">

import { computed, ComputedRef, ref } from 'vue'
import MachineTasks from '@/views/machines/MachineTasks.vue'
import MachineStorages from '@/views/machines/MachineStorages.vue'
import RecentTasksTable from '@/views/widgets/data/RecentTasksTable.vue'
import NewTasks from '@/views/widgets/data/NewTasks.vue'
import { useQuery } from '@vue/apollo-composable'
import { GetMachineById, GetMachineByHostAndPort } from '@/gql/machine'
import { Machine } from '@/typed-graph'
import MachineMetrics from '@/views/machines/MachineMetrics.vue'

const props = defineProps({
  id: { // This is the machine id or hostAndPort
    type: String,
    required: true,
  },
})

const query = isNaN(Number(props.id)) ? GetMachineByHostAndPort : GetMachineById
const variables = isNaN(Number(props.id)) ? { hostAndPort: props.id } : { id: Number(props.id) }

const breadcrumbs = ref([
  {
    title: 'Machines',
    disabled: false,
    to: { name: 'Machines' },
  },
  {
    title: props.id,
    disabled: true,
    to: '#'
  },
])

const { result, loading } = useQuery(query, variables, {})
const machine: ComputedRef<Machine> = computed(() => result.value?.machine || {})

</script>

<template>
  <BaseBreadcrumb :breadcrumbs="breadcrumbs" />
  <v-row>
    <v-col cols="12">
      <MachineMetrics :id="Number(props.id)" />
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12">
      <MachineTasks :id="Number(props.id)" />
    </v-col>
    <v-col cols="12">
      <MachineStorages :id="Number(props.id)" />
    </v-col>
  </v-row>
  <v-row class="mb-0">
    <v-col
      cols="12"
      md="8"
    >
      <RecentTasksTable
        v-if="!loading"
        :host="machine.hostAndPort"
      />
    </v-col>
    <v-col
      cols="12"
      md="4"
    >
      <NewTasks />
    </v-col>
  </v-row>
</template>

<style scoped lang="scss">

</style>
