<script setup lang="ts">

import { useTableSettingsStore } from "@/stores/table"
import { computed } from "vue"

const tableSettings = useTableSettingsStore()

const itemPerPageOptions = [10, 25, 50, 100, 500, 1000, 2000, 5000, 10000]
const sortedItemPerPageOptions = computed({
  get: () => tableSettings.itemsPerPageOptions,
  set: (value) => {
    value.sort((a, b) => a - b)
    tableSettings.itemsPerPageOptions = value
  }
})
</script>

<template>
  <v-card variant="flat">
    <v-card variant="outlined">
      <div class="pa-5">
        <h5 class="text-subtitle-1 mb-0">
          Table Settings
        </h5>
      </div>
      <v-divider />
      <v-card-text>
        <v-list
          density="compact"
          aria-label="setup list"
          aria-busy="true"
        >
          <v-list-item class="pa-0">
            <v-list-item-title class="text-h6 text-lightText">
              Default Items Per Page
            </v-list-item-title>
            <template #append>
              <v-select
                v-model="tableSettings.itemsPerPage"
                :items="tableSettings.itemsPerPageOptions"
                density="compact"
                variant="outlined"
                hide-details
              />
            </template>
          </v-list-item>
          <v-list-item class="pa-0 mt-2">
            <v-list-item-title class="text-h6 text-lightText">
              Items Per Page Options
            </v-list-item-title>
            <template #append>
              <v-select
                v-model="sortedItemPerPageOptions"
                :items="itemPerPageOptions"
                multiple
                hide-details
                variant="outlined"
              />
            </template>
          </v-list-item>
          <v-list-item class="pa-0 mt-2">
            <v-list-item-title class="text-h6 text-lightText">
              Fixed Header
            </v-list-item-title>
            <template #append>
              <v-switch
                v-model="tableSettings.fixedHeader"
                color="primary"
                hide-details
                inset
              />
            </template>
          </v-list-item>
          <v-list-item class="pa-0 mt-2">
            <v-list-item-title class="text-h6 text-lightText">
              Hover
            </v-list-item-title>
            <template #append>
              <v-switch
                v-model="tableSettings.hover"
                color="primary"
                hide-details
                inset
              />
            </template>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </v-card>
</template>

<style scoped lang="scss">

</style>
