<script setup lang="ts">

import { ref } from 'vue'
import TabCard from "@/views/mining/overview/TabCard.vue"

import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const breadcrumbs = ref([
  {
    title: t('nav.Wins'),
    disabled: true,
    to: '#'
  }
])
</script>

<template>
  <BaseBreadcrumb :breadcrumbs="breadcrumbs" />
  <v-row>
    <v-col cols="12">
      <TabCard />
    </v-col>
  </v-row>
</template>

<style scoped lang="scss">

</style>
