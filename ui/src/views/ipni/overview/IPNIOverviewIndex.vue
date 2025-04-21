<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import OverviewCard from './OverviewCard.vue'
import RecentAdvertisements from './RecentAdvertisements.vue'
import RecentTasks from './RecentTasks.vue'
import TopProviders from './TopProviders.vue'

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
    <v-col
      cols="12"
      md="6"
    >
      <RecentAdvertisements />
    </v-col>

    <v-col
      cols="12"
      md="6"
    >
      <TopProviders />
    </v-col>
    <v-col
      cols="12"
    >
      <RecentTasks />
    </v-col>
  </v-row>
</template>

<style scoped>

</style>
