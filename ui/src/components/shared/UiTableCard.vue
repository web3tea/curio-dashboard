<script setup lang="ts">
import { IconSearch } from '@tabler/icons-vue'

const searchValue = defineModel({ type: String })

</script>
<template>
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
            <slot name="actions" />
          </div>
        </v-col>
      </v-row>
    </v-card-item>
    <v-card-text class="pa-0">
      <slot />
    </v-card-text>
  </v-card>
</template>
