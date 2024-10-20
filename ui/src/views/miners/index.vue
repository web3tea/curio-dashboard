<script setup lang="ts">

import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue'
import { ref } from 'vue'
import MinerList from '@/views/miners/MinerList.vue'

const breadcrumbs = ref([
  {
    title: 'Miners',
    disabled: false,
    href: '#',
  },
  {
    title: 'List',
    disabled: true,
    href: '#',
  },
])

</script>

<template>
  <BaseBreadcrumb :breadcrumbs="breadcrumbs" />
  <v-row>
    <v-col cols="12" lg="12">
      <MinerList />
    </v-col>
    <v-col cols="12" />
  </v-row>
</template>

<style scoped lang="scss">

</style>
