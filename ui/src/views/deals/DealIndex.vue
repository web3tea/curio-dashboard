<script setup lang="ts">
import { ref } from 'vue'
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue'
import PendingDeals from '@/views/deals/PendingDeals.vue'

const breadcrumbs = ref([
  {
    title: 'Deals',
    disabled: false,
    href: '#', // todo: add href
  },
  {
    title: 'Pending',
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
      lg="12"
    >
      <PendingDeals />
    </v-col>
  </v-row>
</template>

<style scoped lang="scss">

</style>
