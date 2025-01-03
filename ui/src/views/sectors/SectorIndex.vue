<script setup lang="ts">
import { ref } from 'vue'
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue'
import SectorList from '@/views/sectors/SectorList.vue'

const breadcrumbs = ref([
  {
    title: 'Sectors',
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
    <v-col
      cols="12"
      lg="12"
    >
      <SectorList />
    </v-col>
    <v-col cols="12" />
  </v-row>
</template>

<style scoped lang="scss">

</style>
