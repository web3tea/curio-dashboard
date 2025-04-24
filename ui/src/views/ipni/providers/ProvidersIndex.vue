<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import ProviderList from './ProviderList.vue'

const { t } = useI18n()

// Breadcrumbs for navigation
const breadcrumbs = ref([
  {
    title: t('nav.IPNI'),
    to: { name: 'IPNIOverview' },
    disabled: false,
  },
  {
    title: t('ipni.providers'),
    to: { name: 'IPNIProviders' },
    disabled: true,
  }
])
</script>

<template>
  <BaseBreadcrumb :breadcrumbs="breadcrumbs" />
  <ProviderList />
</template>