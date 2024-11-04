<script setup lang="ts">
import { ref } from 'vue'
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue'
import RunningTaskList from '@/views/task/RunningTaskList.vue'

const breadcrumbs = ref([
  {
    title: 'Tasks',
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
      <RunningTaskList />
    </v-col>
  </v-row>
</template>

<style scoped>

</style>
