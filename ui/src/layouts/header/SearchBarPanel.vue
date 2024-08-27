<script setup>
// icons
import { SearchOutlined } from '@ant-design/icons-vue'
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
      <SearchOutlined :style="{ fontSize: '12px', color: 'rgb(var(--v-theme-lightText))' }" />
    </template>
  </v-text-field>
</template>
