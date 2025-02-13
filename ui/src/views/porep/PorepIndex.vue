<script setup lang="ts">
import { ref } from 'vue'
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue'
import SectorList from '@/views/porep/SectorList.vue'

const breadcrumbs = ref([
  {
    title: 'PoRep',
    disabled: false,
    to: { name: 'PoRep' }
  }
])
</script>

<template>
  <BaseBreadcrumb :breadcrumbs="breadcrumbs" />
  <v-row>
    <v-col
      cols="12"
      md="12"
    >
      <SectorList />
    </v-col>
  </v-row>
</template>

<style scoped>

</style>
