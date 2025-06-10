<script setup lang="ts">
import { ref } from 'vue'
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue'
import WdpostProofsTable from '@/views/wdpost/widgets/WdpostProofsTable.vue'

import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const breadcrumbs = ref([
  {
    title: t('nav.Proofs'),
    disabled: false,
    to: { name: 'Wdpost' }
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
      <WdpostProofsTable />
    </v-col>
  </v-row>
</template>

<style scoped lang="scss">

</style>