<script setup lang="ts">

import { computed, ComputedRef, ref } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { IconBrandAsana } from '@tabler/icons-vue'
import { GetTasksCount } from '@/gql/task'
import moment from 'moment'

const { result, onResult } = useQuery(GetTasksCount, null, () => ({
  fetchPolicy: 'cache-first',
  pollInterval: 3000,
}))
const updateTime = ref(new Date())
const count: ComputedRef<number> = computed(() => result.value?.tasksCount || 0)
onResult(() => {
  updateTime.value = new Date()
})
</script>

<template>
  <v-card elevation="0">
    <v-card variant="outlined">
      <v-card-text>
        <div class="d-flex align-items-center justify-space-between">
          <div>
            <h5 class="text-h5 justify-space-between">{{ $t('fields.Running Tasks') }}</h5>
            <h3 class="text-h3 my-2">{{ count }}</h3>
            <h6 class="text-caption font-weight-medium mb-0">
              updated {{ moment(updateTime).fromNow() }}
            </h6>
          </div>
          <span class="d-flex align-center">
            <v-btn
              :icon="IconBrandAsana"
              rounded="md"
              size="small"
              :to="{ name: 'RunningTasks' }"
              variant="flat"
            />
          </span>
        </div>
      </v-card-text>
    </v-card>
  </v-card>
</template>

<style scoped lang="scss">

</style>
