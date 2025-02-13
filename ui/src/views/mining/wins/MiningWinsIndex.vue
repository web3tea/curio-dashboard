<script setup lang="ts">
import { ref } from 'vue'
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue'
import MiningTaskList from '@/views/mining/wins/MiningTaskList.vue'

const breadcrumbs = ref([
  {
    title: 'Mining',
    disabled: true,
    to: '#'
  },
  {
    title: 'Wins',
    disabled: true,
    to: '#',
  },
])

</script>

<template>
  <BaseBreadcrumb :breadcrumbs="breadcrumbs" />
  <v-row>
    <v-col
      cols="12"
      lg="12"
    >
      <MiningTaskList />
    </v-col>
  </v-row>
</template>

<style scoped lang="scss">

</style>
