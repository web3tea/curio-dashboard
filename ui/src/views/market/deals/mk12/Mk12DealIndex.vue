<script setup lang="ts">
import BaseBreadcrumb from "@/components/shared/BaseBreadcrumb.vue"
import { ref } from "vue"
import Mk12DealList from "./Mk12DealList.vue"

const breadcrumbs = ref([
  {
    title: 'Deals',
    disabled: true,
    to: '#',
  },
  {
    title: 'MK12 Deals',
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
      <Mk12DealList />
    </v-col>
  </v-row>
</template>
