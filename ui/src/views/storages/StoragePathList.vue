<script setup lang="ts">
import { GetStoragePaths } from '@/gql/storage'
import { useQuery } from '@vue/apollo-composable'
import { StoragePath } from '@/typed-graph'
import { computed, ComputedRef, ref } from 'vue'
import { IconReload, IconSearch } from '@tabler/icons-vue'
import { getColorByType } from '@/utils/helpers/storageTypeColor'

const { result, loading, refetch, error } = useQuery(GetStoragePaths, null, () => ({
  fetchPolicy: 'cache-first',
}))

const items: ComputedRef<[StoragePath]> = computed(() => result.value?.storagePaths || [])

const filteredItems = computed(() => {
  return filteredItemsByType(tab.value).value
})

const filteredItemsByType = (type: string) => computed(() => {
  if (type === 'All') {
    return items.value
  }
  return items.value.filter(item => item.type === type)
})

const searchValue = ref('')

const tab = ref('All')

const tabs = ['All', 'Seal', 'Store', 'Hybrid', 'Readonly']
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
              md="6"
            >
              <v-tabs
                v-model="tab"
                color="primary"
              >
                <template
                  v-for="t in tabs"
                  :key="t"
                >
                  <v-tab
                    class="font-weight-medium"
                    :value="t"
                  >
                    {{ t }}
                    <v-chip
                      class="ml-2 font-weight-medium"
                      :color="getColorByType(t)"
                      label
                      size="small"
                    >
                      {{ filteredItemsByType(t).value.length }}
                    </v-chip>
                  </v-tab>
                </template>
              </v-tabs>
            </v-col>
            <v-col
              cols="12"
              md="3"
            >
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
          <StoragePathTable
            :error="error"
            :items="filteredItems"
            :loading="loading"
            :search="searchValue"
          />
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped lang="scss">

</style>
