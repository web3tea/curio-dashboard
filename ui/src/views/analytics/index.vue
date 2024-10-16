<script setup lang="ts">
import ActiveTaskChart from '@/views/widgets/chart/ActiveTaskChart.vue'
import TasksStats from '@/views/widgets/statistics/TasksStats.vue'
</script>

<template>
  <v-row class="my-0">
    <v-col
      cols="12"
    >
      <ActiveTaskChart />
    </v-col>
  </v-row>
  <v-row class="mb-0">
    <v-col cols="12" md="4">
      <TasksStats />
    </v-col>
  </v-row>
</template>
