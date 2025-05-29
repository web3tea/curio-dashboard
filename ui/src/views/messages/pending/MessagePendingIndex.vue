<script setup lang="ts">
import { ref } from "vue"
import BaseBreadcrumb from "@/components/shared/BaseBreadcrumb.vue"
import MessageWaitsTable from "@/views/messages/widgets/MessageWaitsTable.vue"

import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const breadcrumbs = ref([
  {
    title: t('nav.Messages'),
    disabled: true,
    to: '#',
  },
  {
    title: t('nav.messagePending'),
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
      <MessageWaitsTable />
    </v-col>
  </v-row>
</template>

<style scoped lang="scss">

</style>