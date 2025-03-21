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
import ClusterHealthCard from './widgets/ClusterHealthCard.vue'
import TaskSuccessRateCard from './widgets/TaskSuccessRateCard.vue'
import StorageUsedCard from './widgets/StorageUsedCard.vue'
import SectorSummaryCard from './widgets/SectorSummaryCard.vue'
import DealCountSummaryCard from './widgets/DealCountSummaryCard.vue'
import MiningStatusCard from './widgets/MiningStatusCard.vue'

const smallCards = [
  { component: ClusterHealthCard },
  { component: TaskSuccessRateCard },
  { component: StorageUsedCard },
  { component: SectorSummaryCard },
  { component: DealCountSummaryCard },
  { component: MiningStatusCard },
  { component: MinerPower },
  { component: CompletedTasks },
  { component: BlocksMined },
  { component: RunningTasksCount }
]

const middleRowData = [
  { component: CompletedTaskOverviewChart, md: 8 },
  { component: MiningOverviewChart, md: 4 }
]

const infoRowData = [
  { component: ChainConnectivity, md: 6 },
  { component: StorageOverview, md: 6 }
]

const bottomRowData = [
  { component: RecentTasksTable, md: 8 },
  { component: NewTasks, md: 4 }
]
</script>

<template>
  <v-row class="my-0">
    <v-col
      v-for="(card, index) in smallCards"
      :key="index"
      cols="12"
      md="3"
      sm="6"
    >
      <component :is="card.component" />
    </v-col>
  </v-row>
  <v-row class="mb-0">
    <v-col
      v-for="(item, index) in middleRowData"
      :key="index"
      cols="12"
      :md="item.md"
    >
      <component :is="item.component" />
    </v-col>
  </v-row>
  <v-row>
    <v-col
      v-for="(item, index) in infoRowData"
      :key="index"
      cols="12"
      :md="item.md"
    >
      <component :is="item.component" />
    </v-col>
  </v-row>
  <v-row class="mb-0">
    <v-col
      v-for="(item, index) in bottomRowData"
      :key="index"
      cols="12"
      :md="item.md"
    >
      <component :is="item.component" />
    </v-col>
  </v-row>
</template>
