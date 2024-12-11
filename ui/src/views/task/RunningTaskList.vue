<script setup lang="ts">
import { useQuery } from '@vue/apollo-composable'
import { computed, ComputedRef, ref } from 'vue'
import { Task } from '@/typed-graph'
import { GetRunningTasks } from '@/gql/task'
import { IconReload, IconSearch } from '@tabler/icons-vue'

const { result, loading, refetch } = useQuery(GetRunningTasks, null, () => ({
  fetchPolicy: 'cache-and-network',
  pollInterval: 3000,
}))

const items: ComputedRef<[Task]> = computed(() => result.value?.tasks || [])
const headers = [
  { title: 'ID', key: 'id' },
  { title: 'Name', key: 'name' },
  { title: 'Posted Time', key: 'postedTime' },
  { title: 'Update Time', key: 'updateTime' },
  { title: 'Added By', key: 'addedByID' },
  { title: 'Owner', key: 'ownerId' },
  { title: 'Initiated By', key: 'initiatedByID' },
  { title: 'Previous Task', key: 'previousTaskID' },
]
const searchValue = ref('')

</script>

<template>
  <v-row>
    <v-col cols="12" md="12">
      <v-card class="bg-surface" elevation="0" variant="outlined">
        <v-card-item>
          <v-row class="align-center" justify="space-between">
            <v-col cols="12" md="3">
              <v-text-field
                v-model="searchValue"
                hide-details
                persistent-placeholder
                placeholder="Search"
                type="text"
                variant="outlined"
              >
                <template #prepend-inner>
                  <IconSearch :size="14" />
                </template>
              </v-text-field>
            </v-col>
            <v-col cols="12" md="3">
              <div class="d-flex ga-2 justify-end">
                <v-btn
                  :icon="IconReload"
                  rounded
                  variant="text"
                  @click="refetch"
                />
              </div>
            </v-col>
          </v-row>
        </v-card-item>
        <v-divider />
        <v-card-text class="pa-0">
          <v-data-table-virtual
            fixed-header
            :headers="headers"
            hover
            :items="items"
            :loading="loading"
            :search="searchValue"
          >
            <template #item.name="{ value }">
              <v-chip>{{ value }}</v-chip>
            </template>
            <template #item.postedTime="{ value }">
              {{ $d(value, 'short') }}
            </template>
            <template #item.updateTime="{ value }">
              {{ $d(value, 'short') }}
            </template>
            <template #item.ownerId="{ item }">
              {{ item.owner? item.owner.hostAndPort : item.ownerId }}
            </template>
            <template #item.addedByID="{ item }">
              {{ item.addedBy? item.addedBy.hostAndPort : item.addedByID }}
            </template>
          </v-data-table-virtual>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>

</template>

<style scoped lang="scss">

</style>
