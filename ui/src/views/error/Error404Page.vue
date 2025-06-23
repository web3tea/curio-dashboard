<script setup lang="ts"></script>

<template>
  <v-row
    class="overflow-hidden bg-containerBg"
    no-gutters
    style="min-height: 100vh"
  >
    <v-col class="d-flex align-center justify-center">
      <div class="text-center">
        <div class="error-icon mb-8">
          <v-icon
            size="120"
            color="primary"
          >
            mdi-alert-circle-outline
          </v-icon>
        </div>
        <h1 class="text-md-h1 text-h2 mb-4">
          404
        </h1>
        <h2 class="text-h4 text-h5 mb-4">
          Page Not Found
        </h2>
        <p class="text-h6 text-lightText mb-8">
          The page you are looking was moved, removed,<br>
          renamed, or might never exist!
        </p>
        <v-btn
          color="primary"
          :to="{name: 'Overview'}"
          variant="flat"
          size="large"
        >
          Back To Home
        </v-btn>
      </div>
    </v-col>
  </v-row>
</template>

<style lang="scss" scoped>
.error-icon {
  opacity: 0.8;
}
</style>
