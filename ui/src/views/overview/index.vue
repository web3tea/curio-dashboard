<script setup lang="ts">
import ActiveTaskChart from '@/views/widgets/chart/ActiveTaskChart.vue'
import RecentTasks from '@/views/widgets/data/RecentTasks.vue'
import MinerPower from '@/views/widgets/statistics/MinerPower.vue'
import CompletedTasks from '@/views/widgets/statistics/CompletedTasks.vue'
</script>

<template>
  <v-row class="my-0">
    <v-col
      cols="12"
      md="3"
      sm="6"
    >
      <MinerPower />
    </v-col>
    <v-col
      cols="12"
      md="3"
      sm="6"
    >
      <CompletedTasks />
    </v-col>
    <v-col
      cols="12"
      md="3"
      sm="6"
    >
      <MinerPower />
    </v-col>
    <v-col
      cols="12"
      md="3"
      sm="6"
    >
      <MinerPower />
    </v-col>
  </v-row>
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
