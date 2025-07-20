<script setup lang="ts">
import { ref } from 'vue'
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue'
import SnapList from '@/views/sectors/SnapList.vue'

import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const breadcrumbs = ref([
  {
    title: t('nav.Sectors'),
    disabled: false,
    to: { name: 'Sectors' }
  },
  {
    title: t('nav.Snap'),
    disabled: true,
    to: { name: 'Snap' }
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
      <SnapList />
    </v-col>
    <v-col cols="12" />
  </v-row>
</template>

<style scoped lang="scss">

</style>