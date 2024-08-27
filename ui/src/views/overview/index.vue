<script setup lang="ts">
// imported components
import ActiveTaskChart from '@/views/widgets/chart/ActiveTaskChart.vue'
import WidgetFive from '@/views/widgets/statistics/WidgetFive.vue'
import RecentTasks from '@/views/widgets/data/RecentTasks.vue'
</script>

<template>
  <WidgetFive />
  <v-row class="mb-0">
    <v-col cols="12" md="8">
      <ActiveTaskChart />
    </v-col>
    <v-col cols="12" md="4">
      <CardHeader title="Recently Finished Tasks">
        <template #header>
          <router-link class="text-h6 text-primary link-hover" to="#">View all</router-link>
        </template>
        <RecentTasks />
      </CardHeader>
    </v-col>
  </v-row>
  <v-row class="mb-0">
    <v-col cols="12" md="8" />
    <v-col cols="12" md="4" />
  </v-row>
  <v-row>
    <v-col cols="12" md="7" />

    <v-col cols="12" md="5">
      <v-row>
        <v-col cols="12" />
        <v-col cols="12" />
      </v-row>
    </v-col>
  </v-row>
</template>
