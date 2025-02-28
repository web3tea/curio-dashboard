<script setup lang="ts">
import { ref } from "vue"
import BaseBreadcrumb from "@/components/shared/BaseBreadcrumb.vue"
import TableSettings from "@/views/settings/TableSettings.vue"

import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const breadcrumbs = ref([
  {
    title: t('nav.Settings'),
    disabled: false,
    to: { name: 'Settings' },
  },
])
</script>

<template>
  <BaseBreadcrumb :breadcrumbs="breadcrumbs" />
  <v-row>
    <v-col
      cols="12"
      lg="6"
    >
      <TableSettings />
    </v-col>
    <v-col
      cols="6"
      lg="6"
    />
  </v-row>
</template>

<style scoped lang="scss">

</style>
