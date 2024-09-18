<script setup lang="ts">
const props = defineProps({
  title: String,
})
</script>

<template>
  <v-card class="bg-surface overflow-hidden" elevation="0" variant="outlined">
    <v-card-item>
      <div class="d-sm-flex align-center justify-space-between">
        <v-card-title class="text-h6" style="line-height: 1.57">{{ props.title }}</v-card-title>
        <slot name="action" />
      </div>
    </v-card-item>
    <v-divider />
    <v-card-text>
      <slot />
    </v-card-text>
  </v-card>
</template>
