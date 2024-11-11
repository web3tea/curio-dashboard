<script setup lang="ts">
import moment from 'moment'
import UiChildCard from '@/components/shared/UiChildCard.vue'
import { useQuery } from '@vue/apollo-composable'
import { computed, ComputedRef } from 'vue'
import { Task } from '@/typed-graph'
import { GetMachineTasks } from '@/gql/machine'
import { IconReload } from '@tabler/icons-vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
})

const { result, loading, refetch } = useQuery(GetMachineTasks, {
  id: props.id,
}, () => ({
  fetchPolicy: 'cache-first',
}))

const tasks: ComputedRef<[Task]> = computed(() => result.value?.machine.tasks || [])

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
  <UiChildCard :title="t('fields.Running Tasks')">
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
      hover
      :items="tasks"
      :loading="loading"
    >
      <template #item.owner="{ value }">
        <!--        todo: add router link to worker details-->
        <p class="text-high-emphasis">{{ value ? value.hostAndPort : '' }} </p>
      </template>
      <template #item.name="{ value }">
        <v-chip color="primary" small>{{ value }}</v-chip>
      </template>
      <template #item.updateTime="{ value }">
        {{ moment(value).calendar() }}
      </template>
      <template #item.postedTime="{ value }">
        {{ moment(value).calendar() }}
      </template>
      <template #item.previousTask="{ value }">
        <!--        todo: add router link to previous task details-->
        {{ value ? value.name : '' }}
      </template>
    </v-data-table-virtual>
  </UiChildCard>
</template>

<style scoped lang="scss">

</style>
