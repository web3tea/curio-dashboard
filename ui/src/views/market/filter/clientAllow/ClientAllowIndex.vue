<script setup lang="ts">

import { ref } from "vue"
import ClientAllowList from "./ClientAllowList.vue"

const breadcrumbs = ref([
  {
    title: 'Market',
    disabled: true,
    to: '#',
  },
  {
    title: 'Client Allow/Deny',
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
        type="info"
        text="Specify wallets to explicitly allow or deny deals from, overriding the default client acceptance behavior."
      />
    </v-col>
    <v-col
      cols="12"
    >
      <ClientAllowList />
    </v-col>
  </v-row>
</template>
