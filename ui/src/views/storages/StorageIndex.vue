<script setup lang="ts">
import { ref } from 'vue'
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue'
import StoragePathList from '@/views/storages/StoragePathList.vue'
import StorageUsageChart from '@/views/storages/StorageUsageChart.vue'

import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const breadcrumbs = ref([
  {
    title: t('nav.Storages'),
    disabled: false,
    to: { name: 'Storages' }
  }
])

</script>

<template>
  <BaseBreadcrumb :breadcrumbs="breadcrumbs" />
  <v-row>
    <v-col
      cols="12"
      lg="12"
    >
      <StorageUsageChart />
    </v-col>
    <v-col cols="12">
      <StoragePathList />
    </v-col>
  </v-row>
</template>

<style scoped>

</style>
