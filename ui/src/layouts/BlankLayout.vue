<template>
  <v-app>
    <LoaderWrapper />
    <RouterView v-slot="{ Component }">
      <KeepAlive>
        <component :is="Component" />
      </KeepAlive>
    </RouterView>
  </v-app>
</template>
<script setup lang="ts">
import { RouterView } from 'vue-router'
import LoaderWrapper from '@/layouts/LoaderWrapper.vue'
</script>
