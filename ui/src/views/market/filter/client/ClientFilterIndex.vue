<script setup lang="ts">

import { ref } from "vue"
import ClientFilterList from "./ClientFilterList.vue"

import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const breadcrumbs = ref([
  {
    title: t('nav.Market'),
    disabled: true,
    to: '#',
  },
  {
    title: t('nav.Client Filters'),
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
