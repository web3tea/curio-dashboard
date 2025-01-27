<script setup lang="ts">

import { ref } from "vue"
import PriceFilter from "./PriceFilterList.vue"

const breadcrumbs = ref([
  {
    title: 'Market',
    disabled: true,
    to: '#',
  },
  {
    title: 'Price Filter',
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
      <PriceFilter />
    </v-col>
  </v-row>
</template>
