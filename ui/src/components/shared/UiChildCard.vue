<script setup lang="ts">

const props = defineProps({
  title: {
    type: String,
    required: false,
    default: undefined
  },
  loading: Boolean,
})
</script>

<template>
  <v-card class="bg-surface" variant="outlined">
    <v-card-item>
      <v-row class="align-center" justify="space-between">
        <v-col cols="12" md="9">
          <v-card-title class="text-h5">{{ props.title }}</v-card-title>
        </v-col>
        <v-col cols="12" md="3">
          <div class="d-flex ga-2 justify-end">
            <slot name="action" />
          </div>
        </v-col>
      </v-row>
    </v-card-item>
    <v-divider />
    <v-card-text v-if="!loading">
      <slot />
    </v-card-text>
    <v-skeleton-loader v-else type="card" />
  </v-card>
</template>
