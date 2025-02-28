<script setup lang="ts">
import BaseBreadcrumb from "@/components/shared/BaseBreadcrumb.vue"
import { ref } from "vue"
import Mk12DealList from "./Mk12DealList.vue"

import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const breadcrumbs = ref([
  {
    title: t('nav.Deals'),
    disabled: true,
    to: '#',
  },
  {
    title: t('nav.MK12Deals'),
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
