<script setup lang="ts">

const props = defineProps({
  title: {
    type: String,
    required: false,
    default: undefined
  },
  className: {
    type: String,
    required: false,
    default: undefined
  },
})
</script>

<template>
  <v-card
    class="title-card"
    rounded="md"
    variant="text"
  >
    <v-card-item class="pb-2 px-0 pt-0">
      <div class="d-flex justify-space-between">
        <v-card-title class="text-h5">
          {{ props.title }}
        </v-card-title>
        <slot name="action" />
      </div>
    </v-card-item>
    <v-card-text
      :class="`${props.className}`"
      variant="outlined"
    >
      <slot />
    </v-card-text>
  </v-card>
</template>
