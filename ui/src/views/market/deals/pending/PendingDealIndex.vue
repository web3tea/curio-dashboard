<script setup lang="ts">
import { ref } from 'vue'
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue'
import PendingDealList from '@/views/market/deals/pending/PendingDealList.vue'

const breadcrumbs = ref([
  {
    title: 'Deals',
    disabled: true,
    to: "#"
  },
  {
    title: 'Pending Pieces',
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
