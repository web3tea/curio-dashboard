<script setup>
// icons
import { IconSearch } from '@tabler/icons-vue'
</script>

<template>
  <!-- ---------------------------------------------- -->
  <!-- searchbar -->
  <!-- ---------------------------------------------- -->
  <v-text-field
    color="primary"
    density="compact"
    hide-details
    persistent-placeholder
    placeholder="Ctrl + k"
    variant="outlined"
  >
    <template #prepend-inner>
      <IconSearch
        :size="12"
        color="rgb(var(--v-theme-lightText))"
      />
    </template>
  </v-text-field>
</template>
