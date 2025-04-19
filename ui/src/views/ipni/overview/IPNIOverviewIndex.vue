<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import OverviewCard from './OverviewCard.vue'

const { t } = useI18n()

const breadcrumbs = ref([
  {
    title: t('nav.IPNI'),
    to: { name: 'IPNIOverview' },
    disabled: false,
  }
])

</script>
<template>
  <BaseBreadcrumb :breadcrumbs="breadcrumbs" />
  <v-row>
    <v-col
      cols="12"
    >
      <OverviewCard />
    </v-col>
  </v-row>
</template>

<style scoped>

</style>
