<script setup lang="ts">

import { ref } from "vue"
import ClientAllowList from "./ClientAllowList.vue"
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const breadcrumbs = ref([
  {
    title: t('nav.Market'),
    disabled: true,
    to: '#',
  },
  {
    title: t('nav.Client Allow/Deny'),
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
