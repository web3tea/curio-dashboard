<script setup lang="ts">

import { ref } from 'vue'
import TabCard from "@/views/mining/overview/TabCard.vue"

const breadcrumbs = ref([
  {
    title: 'Wins',
    disabled: true,
    to: '#'
  }
])
</script>

<template>
  <BaseBreadcrumb :breadcrumbs="breadcrumbs" />
  <v-row>
    <v-col cols="12">
      <TabCard />
    </v-col>
  </v-row>
</template>

<style scoped lang="scss">

</style>
