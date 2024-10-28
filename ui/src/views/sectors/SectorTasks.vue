<script setup lang="ts">
import moment from 'moment'
import UiChildCard from '@/components/shared/UiChildCard.vue'
import { useQuery } from '@vue/apollo-composable'
import { GetSectorTasks } from '@/views/query/sector'
import { computed, ComputedRef } from 'vue'
import { Task } from '@/typed-graph'
import { IconReload } from '@tabler/icons-vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

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

const { result, loading, refetch } = useQuery(GetSectorTasks, {
  miner: props.miner,
  sectorNumber: props.sectorNumber,
}, () => ({
  fetchPolicy: 'cache-first',
}))

const tasks: ComputedRef<[Task]> = computed(() => result.value?.sector.tasks || [])

const headers = [
  { title: 'ID', key: 'id' },
  { title: 'Name', key: 'name' },
  { title: 'Worker', key: 'owner' },
  { title: 'Update', key: 'updateTime' },
  { title: 'Posted', key: 'postedTime' },
  { title: 'previousTask', key: 'previousTask' },
]

</script>

<template>
  <UiChildCard :title="t('fields.Sector Tasks')">
    <template #action>
      <v-btn
        :icon="IconReload"
        round
        :rounded="true"
        variant="text"
        @click="refetch"
      />
    </template>
    <v-data-table-virtual
      fixed-header
      :headers="headers"
      height="400"
      hover
      :items="tasks"
      :loading="loading"
    >
      <template #item.owner="{ item }">
        <!--        todo: add router link to worker details-->
        <p class="text-high-emphasis">{{ item.owner ? item.owner.hostAndPort : '' }} </p>
      </template>
      <template #item.name="{ item }">
        <v-chip color="primary" small>{{ item.name }}</v-chip>
      </template>
      <template #item.updateTime="{ item }">
        {{ moment(item.updateTime).calendar() }}
      </template>
      <template #item.postedTime="{ item }">
        {{ moment(item.postedTime).calendar() }}
      </template>
      <template #item.previousTask="{ item }">
        <!--        todo: add router link to previous task details-->
        {{ item.previousTask ? item.previousTask.name : '' }}
      </template>
    </v-data-table-virtual>
  </UiChildCard>
</template>

<style scoped lang="scss">

</style>
