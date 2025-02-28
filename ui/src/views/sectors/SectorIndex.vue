<script setup lang="ts">
import { ref } from 'vue'
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue'
import SectorList from '@/views/sectors/SectorList.vue'

import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const breadcrumbs = ref([
  {
    title: t('nav.Sectors'),
    disabled: false,
    to: { name: 'Sectors' }
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
      <SectorList />
    </v-col>
    <v-col cols="12" />
  </v-row>
</template>

<style scoped lang="scss">

</style>
