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
    title: 'Pricing Filters',
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
      <v-alert
        closable
        type="warning"
        text="New deal proposals are accepted if they match the first applicable rule; otherwise, default ask is applied, or the proposal is rejected."
      />
    </v-col>
    <v-col
      cols="12"
    >
      <PriceFilter />
    </v-col>
  </v-row>
</template>
