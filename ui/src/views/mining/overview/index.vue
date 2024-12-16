<script setup lang="ts">

import { ref } from 'vue'
import TabCard from "@/views/mining/overview/TabCard.vue"
import InvoiceStatus from "@/views/mining/overview/InvoiceStatus.vue"

const breadcrumbs = ref([
  {
    title: 'Wins',
    disabled: false,
    href: '#'
  },
  {
    title: 'Overview',
    disabled: true,
    href: '#'
  }
])
</script>

<template>
  <BaseBreadcrumb  :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <v-row>
    <v-col cols="12" xl="9" lg="7">
      <TabCard />
    </v-col>
    <v-col cols="12" xl="3" lg="5">
      <InvoiceStatus />
    </v-col>
  </v-row>
</template>

<style scoped lang="scss">

</style>
