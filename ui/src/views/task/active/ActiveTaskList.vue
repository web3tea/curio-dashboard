<script setup lang="ts">
import { useQuery } from '@vue/apollo-composable'
import { computed, ComputedRef, ref } from 'vue'
import { Task } from '@/typed-graph'
import { GetRunningTasks } from '@/gql/task'
import { IconReload, IconSearch } from '@tabler/icons-vue'
import { useI18n } from 'vue-i18n'
import { getRelativeTime } from '@/utils/helpers/time'

const { t } = useI18n()

const { result, loading, refetch } = useQuery(GetRunningTasks, null, () => ({
  fetchPolicy: 'network-only',
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
const showBackgroundTasks = ref(false)

const filteredItems = computed(() => {
  if (showBackgroundTasks.value) {
    return items.value
  } else {
    return items.value.filter(task => !task.name.startsWith('bg:'))
  }
})
</script>

<template>
  <v-row>
    <v-col
      cols="12"
      md="12"
    >
      <v-card
        class="bg-surface"
        elevation="0"
        variant="outlined"
      >
        <v-card-item>
          <v-row
            class="align-center"
            justify="space-between"
          >
            <v-col
              cols="12"
              md="3"
            >
              <v-text-field
                v-model="searchValue"
                hide-details
                persistent-placeholder
                :placeholder="t('fields.Search')"
                type="text"
                variant="outlined"
              >
                <template #prepend-inner>
                  <IconSearch :size="14" />
                </template>
              </v-text-field>
            </v-col>
            <v-col
              cols="12"
              md="6"
              class="d-flex align-center"
            >
              <v-switch
                v-model="showBackgroundTasks"
                :label="t('activeTask.showBackgroundTasks')"
                hide-details
                density="compact"
              />
            </v-col>
            <v-col
              cols="12"
              md="3"
            >
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
            :items="filteredItems"
            :loading="loading"
            :search="searchValue"
          >
            <template #item.postedTime="{ value }">
              {{ getRelativeTime(value, "short") }}
            </template>
            <template #item.updateTime="{ value }">
              {{ getRelativeTime(value, "short") }}
            </template>

            <template #item.ownerId="{item}">
              <template v-if="item.owner">
                <RouterLink
                  v-if="item.ownerId"
                  :to="{ name: 'MachineInfo', params: { id: Number(item.ownerId) } }"
                >
                  {{ item.owner.hostAndPort }}
                </RouterLink>
                <template v-else>
                  -
                </template>
              </template>
              <template v-else>
                {{ item.ownerId }}
              </template>
            </template>
            <template #item.addedByID="{ item }">
              <template v-if="item.addedBy">
                <RouterLink
                  v-if="item.addedByID"
                  :to="{ name: 'MachineInfo', params: { id: Number(item.addedByID) } }"
                >
                  {{ item.addedBy.hostAndPort }}
                </RouterLink>
                <template v-else>
                  -
                </template>
              </template>
              <template v-else>
                {{ item.addedByID }}
              </template>
            </template>
            <template #item.initiatedByID="{item}">
              <template v-if="item.initiatedBy">
                <RouterLink
                  v-if="item.initiatedByID"
                  :to="{ name: 'MachineInfo', params: { id: Number(item.initiatedByID) } }"
                >
                  {{ item.initiatedBy.hostAndPort }}
                </RouterLink>
                <template v-else>
                  -
                </template>
              </template>
              <template v-else>
                {{ item.initiatedByID }}
              </template>
            </template>
          </v-data-table-virtual>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped lang="scss">

</style>
