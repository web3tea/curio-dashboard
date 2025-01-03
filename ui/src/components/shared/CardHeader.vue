<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    required: false,
    default: undefined
  },
})
</script>

<template>
  <v-card
    class="bg-surface"
    elevation="0"
    variant="outlined"
  >
    <v-card-item>
      <div class="d-flex justify-space-between align-center">
        <v-card-title class="text-h6">
          {{ props.title }}
        </v-card-title>
        <slot name="header" />
      </div>
    </v-card-item>
    <v-divider />
    <v-card-text class="pa-0">
      <slot />
    </v-card-text>
  </v-card>
</template>
