<script setup lang="ts">

import { ref } from 'vue'
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue'
import TaskHistoryList from '@/views/task/history/TaskHistoryList.vue'

const breadcrumbs = ref([
  {
    title: 'Task History',
    disabled: false,
    href: '#',
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
    <v-col cols="12" lg="12">
      <TaskHistoryList />
    </v-col>
  </v-row>
</template>

<style scoped lang="scss">

</style>
