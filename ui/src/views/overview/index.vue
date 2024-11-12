<script setup lang="ts">
import MinerPower from '@/views/widgets/statistics/MinerPower.vue'
import CompletedTasks from '@/views/widgets/statistics/CompletedTasks.vue'
import MiningOverviewChart from '@/views/widgets/chart/MiningOverviewChart.vue'
import RecentTasksTable from '@/views/widgets/data/RecentTasksTable.vue'
import NewTasks from '@/views/widgets/data/NewTasks.vue'
import ChainConnectivity from '@/views/widgets/data/ChainConnectivity.vue'
import StorageOverview from '@/views/widgets/statistics/StorageOverview.vue'
import CompletedTaskOverviewChart from '@/views/widgets/chart/CompletedTaskOverviewChart.vue'
import BlocksMined from '@/views/widgets/statistics/BlocksMined.vue'
import RunningTasksCount from '@/views/widgets/statistics/RunningTasksCount.vue'
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
      <BlocksMined />
    </v-col>
    <v-col
      cols="12"
      md="3"
      sm="6"
    >
      <RunningTasksCount />
    </v-col>
  </v-row>
  <v-row class="mb-0">
    <v-col cols="12" md="8">
      <CompletedTaskOverviewChart />
    </v-col>
    <v-col cols="12" md="4">
      <MiningOverviewChart />
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12" md="6">
      <ChainConnectivity />
    </v-col>

    <v-col cols="12" md="6">
      <StorageOverview />
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
</template>
