<script setup lang="ts">
import { ref } from "vue"
import BaseBreadcrumb from "@/components/shared/BaseBreadcrumb.vue"
import BalanceList from "./BalanceList.vue"

const breadcrumbs = ref([
  {
    title: 'Market',
    disabled: true,
    href: '#',
  },
  {
    title: 'Balances',
    disabled: true,
    href: '#',
  },
])
</script>
<template>
  <BaseBreadcrumb :breadcrumbs="breadcrumbs" />
  <v-row>
    <v-col
      cols="12"
    >
      <BalanceList />
    </v-col>
  </v-row>
</template>
