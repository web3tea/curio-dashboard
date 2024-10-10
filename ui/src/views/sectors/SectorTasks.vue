<script setup lang="ts">
import moment from 'moment'
import UiChildCard from '@/components/shared/UiChildCard.vue'
import { useQuery } from '@vue/apollo-composable'
import { GetSectorTasks } from '@/views/query/sector'
import { computed, ComputedRef } from 'vue'
import { Task } from '@/typed-graph'
import type { Header } from 'vue3-easy-data-table'
import { IconReload } from '@tabler/icons-vue'

const props = defineProps({
  miner: {
    type: String,
    required: true,
  },
  sectorNumber: {
    type: String,
    required: true,
  },
})

const { result, loading, refetch, error } = useQuery(GetSectorTasks, {
  miner: props.miner,
  sectorNumber: props.sectorNumber,
}, () => ({
  fetchPolicy: 'cache-first',
}))

const tasks: ComputedRef<[Task]> = computed(() => result.value?.sector.tasks || [])

const headers :Header[] = [
  { text: 'ID', value: 'id' },
  { text: 'Name', value: 'name' },
  { text: 'Worker', value: 'owner' },
  { text: 'Update', value: 'updateTime' },
  { text: 'Posted', value: 'postedTime' },
  { text: 'previousTask', value: 'previousTask' },
]
</script>

<template>
  <UiChildCard :loading="loading" title="Sector Tasks ">
    <template #action>
      <v-btn round :rounded="true" variant="text" @click="refetch">
        <IconReload />
      </v-btn>
    </template>
    <EasyDataTable
      :headers="headers"
      hide-footer
      :items="tasks"
      :loading="loading"
      :rows-per-page="100"
      table-class-name="customize-table"
      theme-color="primary"
    >
      <template #empty-message>
        <p class="text-high-emphasis">{{ error?.message || 'No Data' }} </p>
      </template>
      <template #item-owner="{owner}">
        <!--        todo: add router link to worker details-->
        <p class="text-high-emphasis">{{ owner ? owner.hostAndPort: '' }} </p>
      </template>
      <template #item-name="{name}">
        <v-chip color="primary" small>{{ name }}</v-chip>
      </template>
      <template #item-updateTime="{updateTime}">
        {{ moment(updateTime).calendar() }}
      </template>
      <template #item-postedTime="{postedTime}">
        {{ moment(postedTime).calendar() }}
      </template>
      <template #item-previousTask="{previousTask}">
        <!--        todo: add router link to previous task details-->
        {{ previousTask ? previousTask.name : '' }}
      </template>
    </EasyDataTable>
  </UiChildCard>
</template>

<style scoped lang="scss">

</style>
