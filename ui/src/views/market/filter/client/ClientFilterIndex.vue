<script setup lang="ts">

import { ref } from "vue"
import ClientFilterList from "./ClientFilterList.vue"

const breadcrumbs = ref([
  {
    title: 'Market',
    disabled: true,
    to: '#',
  },
  {
    title: 'Client Filters',
    disabled: true,
    to: '#',
  },
])
</script>
<template>
  <BaseBreadcrumb :breadcrumbs="breadcrumbs" />
  <v-row>
    <v-col
      cols="12"
    >
      <ClientFilterList />
    </v-col>
  </v-row>
</template>
