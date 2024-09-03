<script setup lang="ts">
import { ref } from 'vue'
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue'
import SectorList from '@/views/porep/SectorList.vue'

const page = ref({ title: 'PoRep' })
const breadcrumbs = ref([
  {
    title: 'PoRep',
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
  <BaseBreadcrumb :breadcrumbs="breadcrumbs" :title="page.title" />
  <v-row>
    <v-col cols="12" md="12">
      <SectorList />
    </v-col>
  </v-row>
</template>

<style scoped>

</style>
