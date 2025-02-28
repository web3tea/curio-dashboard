<script setup lang="ts">
import { ref } from "vue"
import BaseBreadcrumb from "@/components/shared/BaseBreadcrumb.vue"
import BalanceList from "./BalanceList.vue"

import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const breadcrumbs = ref([
  {
    title: t('nav.Market'),
    disabled: true,
    to: '#',
  },
  {
    title: t('nav.Balances'),
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
      <BalanceList />
    </v-col>
  </v-row>
</template>
