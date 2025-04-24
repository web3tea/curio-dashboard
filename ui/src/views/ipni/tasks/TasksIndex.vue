<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import TaskList from './TaskList.vue'

const { t } = useI18n()

// Breadcrumbs for navigation
const breadcrumbs = ref([
  {
    title: t('nav.IPNI'),
    to: { name: 'IPNIOverview' },
    disabled: false,
  },
  {
    title: t('ipni.tasks'),
    to: { name: 'IPNITasks' },
    disabled: true,
  }
])
</script>

<template>
  <BaseBreadcrumb :breadcrumbs="breadcrumbs" />
  <TaskList />
</template>