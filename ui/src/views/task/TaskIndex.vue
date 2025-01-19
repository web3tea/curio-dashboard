<script setup lang="ts">
import { ref } from 'vue'
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue'
import RunningTaskList from '@/views/task/RunningTaskList.vue'

const breadcrumbs = ref([
  {
    title: 'Tasks',
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
