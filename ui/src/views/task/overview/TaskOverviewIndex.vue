<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import TaskDurationStats from './widgets/TaskDurationStats.vue'
import TaskCountStats from './widgets/TaskCountStats.vue'
const { t } = useI18n()

const breadcrumbs = ref([
  {
    title: t('nav.Tasks'),
    disabled: true,
    to: '#'
  }
])

</script>
<template>
  <BaseBreadcrumb :breadcrumbs="breadcrumbs" />
  <v-row>
    <v-col
      cols="12"
      md="8"
    >
      <TaskDurationStats />
    </v-col>
    <v-col
      cols="12"
      md="4"
    >
      <TaskCountStats />
    </v-col>
  </v-row>
</template>
