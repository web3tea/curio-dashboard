<script setup lang="ts">
import { ref } from 'vue'
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue'
import RunningTaskList from '@/views/task/RunningTaskList.vue'

import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const breadcrumbs = ref([
  {
    title: t('nav.Tasks'),
    disabled: false,
    to: { name: 'RunningTasks' }
  }
])

</script>

<template>
  <BaseBreadcrumb :breadcrumbs="breadcrumbs" />
  <RunningTaskList />
</template>

<style scoped>

</style>
