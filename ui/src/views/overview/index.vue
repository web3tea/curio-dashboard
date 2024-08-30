<script setup lang="ts">
import ActiveTaskChart from '@/views/widgets/chart/ActiveTaskChart.vue'
import MinerPower from '@/views/widgets/statistics/MinerPower.vue'
import CompletedTasks from '@/views/widgets/statistics/CompletedTasks.vue'
import MiningOverviewChart from '@/views/widgets/chart/MiningOverviewChart.vue'
import RecentTasksTable from '@/views/widgets/data/RecentTasksTable.vue'
import NewTasks from '@/views/widgets/data/NewTasks.vue'
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
      <MiningOverviewChart />
    </v-col>
  </v-row>
  <v-row class="mb-0">
    <v-col cols="12" md="8">
      <RecentTasksTable />
    </v-col>
    <v-col cols="12" md="4">
      <NewTasks />
    </v-col>
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
