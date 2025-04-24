<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import AdvertisementList from './AdvertisementList.vue'

const { t } = useI18n()

// Breadcrumbs for navigation
const breadcrumbs = ref([
  {
    title: t('nav.IPNI'),
    to: { name: 'IPNIOverview' },
    disabled: false,
  },
  {
    title: t('ipni.advertisements'),
    to: { name: 'IPNIAdvertisements' },
    disabled: true,
  }
])
</script>

<template>
  <BaseBreadcrumb :breadcrumbs="breadcrumbs" />
  <AdvertisementList />
</template>