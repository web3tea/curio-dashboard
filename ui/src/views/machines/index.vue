<script setup lang="ts">
import { ref } from 'vue'
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue'
import MachineList from '@/views/machines/MachineList.vue'
import WidgetMachineSummaryCharts from '@/views/machines/MachineSummaryCharts.vue'

const page = ref({ title: 'Machines' })
const breadcrumbs = ref([
  {
    title: 'Machine',
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
    <v-col cols="12" lg="12">
      <WidgetMachineSummaryCharts />
    </v-col>
    <v-col cols="12">
      <MachineList />
    </v-col>
  </v-row>
</template>

<style scoped>

</style>
