<script setup lang="ts">

import { ref } from 'vue'

defineProps({
  id: {
    type: String,
    required: true,
  },
})

const review = ref(30)

</script>

<template>
  <v-card>
    <v-card-title class="text-overline">
      Progress

      <div class="text-green-darken-3 text-h3 font-weight-bold">90%</div>

      <div class="text-h6 text-medium-emphasis font-weight-regular">
        $2,938.00 remaining
      </div>
    </v-card-title>
    <br>
    <v-card-text>
      <div
        class="position-absolute mt-n8 text-caption text-green-darken-3"
        :style="`right: calc(${review} - 32px)`"
      >
        Eligibility review
      </div>
      <v-progress-linear
        color="green-darken-3"
        height="22"
        model-value="90"
        rounded="lg"
      >
        <v-badge
          class="position-absolute"
          color="white"
          dot
          inline
          :style="`right: ${review}`"
        />
      </v-progress-linear>

      <div class="d-flex justify-space-between py-3">
        <span class="text-green-darken-3 font-weight-medium">
          $26,442.00 remitted
        </span>

        <span class="text-medium-emphasis"> $29,380.00 total </span>
      </div>
    </v-card-text>

    <v-divider />

    <v-list-item
      append-icon="mdi-chevron-right"
      lines="two"
      link
      subtitle="Details and agreement"
    />
  </v-card>
</template>

<style scoped lang="scss">

</style>
