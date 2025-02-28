<script setup lang="ts">
import { ref } from 'vue'
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue'
import PendingDealList from '@/views/market/deals/pending/PendingDealList.vue'

import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const breadcrumbs = ref([
  {
    title: t('nav.Deals'),
    disabled: true,
    to: "#"
  },
  {
    title: t('nav.PendingPieces'),
    disabled: true,
    to: { name: 'PendingDeals' },
  },
])

</script>

<template>
  <BaseBreadcrumb :breadcrumbs="breadcrumbs" />
  <v-row>
    <v-col
      cols="12"
      lg="12"
    >
      <PendingDealList />
    </v-col>
  </v-row>
</template>

<style scoped lang="scss">

</style>
