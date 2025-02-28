<script setup lang="ts">

import { ref } from 'vue'
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue'
import TaskHistoryList from '@/views/task/history/TaskHistoryList.vue'

import { useI18n } from 'vue-i18n'
const { t } = useI18n()

defineProps({
  start: {
    type: Number,
    default: undefined
  },
  end: {
    type: Number,
    default: undefined
  },
  name: {
    type: String,
    default: undefined
  },
  machine: {
    type: String,
    default: undefined
  },
  success: {
    type: Boolean,
    default: undefined,
  },
})

const breadcrumbs = ref([
  {
    title: t('nav.Task History'),
    disabled: false,
    to: { name: 'TaskHistory' }
  }
])
</script>

<template>
  <BaseBreadcrumb :breadcrumbs="breadcrumbs" />
  <v-row>
    <v-col
      cols="12"
      lg="12"
    >
      <TaskHistoryList
        :end="end ? new Date(end) : undefined"
        :machine="machine"
        :name="name"
        :start="start ? new Date(start) : undefined"
        :success="success"
      />
    </v-col>
  </v-row>
</template>

<style scoped lang="scss">

</style>
