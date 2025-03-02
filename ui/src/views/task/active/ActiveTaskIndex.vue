<script setup lang="ts">
import { ref } from 'vue'
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue'
import ActiveTaskList from './ActiveTaskList.vue'

import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const breadcrumbs = ref([
  {
    title: t('nav.Tasks'),
    disabled: false,
    to: { name: 'TaskOverview' }
  },
  {
    title: t('nav.Active Tasks'),
    disabled: true,
    to: { name: 'ActiveTasks' }
  }
])

</script>

<template>
  <BaseBreadcrumb :breadcrumbs="breadcrumbs" />
  <ActiveTaskList />
</template>

<style scoped>

</style>
