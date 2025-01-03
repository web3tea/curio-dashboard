<script setup lang="ts">
import { ref } from 'vue'
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue'
import MachineList from '@/views/machines/MachineList.vue'
import WidgetMachineSummaryCharts from '@/views/machines/MachineSummaryCharts.vue'

const breadcrumbs = ref([
  {
    title: 'Machines',
    disabled: false,
    href: '/app/machines',
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
      <WidgetMachineSummaryCharts />
    </v-col>
    <v-col cols="12">
      <MachineList />
    </v-col>
  </v-row>
</template>

<style scoped>

</style>
