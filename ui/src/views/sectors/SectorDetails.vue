<script setup lang="ts">
import { ref } from 'vue'
import PiecesInfo from '@/views/sectors/PiecesInfo.vue'
import SectorLocations from '@/views/sectors/SectorLocations.vue'
import SectorEvents from '@/views/sectors/SectorEvents.vue'
import SectorTasks from '@/views/sectors/SectorTasks.vue'
import SectorInfo from '@/views/sectors/SectorInfo.vue'

const props = defineProps(
  {
    miner: {
      type: String,
      required: true,
    },
    sectorNumber: {
      type: String,
      required: true,
    },
  }
)

const page = ref({ title: 'Sector Details' })
const breadcrumbs = ref([
  {
    title: 'Sectors',
    disabled: false,
    href: '/app/sectors',
  },
  {
    title: props.miner + '-' + props.sectorNumber,
    disabled: true,
    href: '#',
  },
])

</script>
<template>
  <BaseBreadcrumb :breadcrumbs="breadcrumbs" :title="page.title" />
  <v-row>
    <v-col cols="12">
      <SectorInfo :miner="miner" :sector-number="sectorNumber" />
    </v-col>
    <v-col cols="12">
      <PiecesInfo :miner="miner" :sector-number="sectorNumber" />
    </v-col>
    <v-col cols="12">
      <SectorTasks :miner="miner" :sector-number="sectorNumber" />
    </v-col>
    <v-col cols="8">
      <SectorLocations :miner="miner" :sector-number="sectorNumber" />
    </v-col>
    <v-col cols="4">
      <SectorEvents :miner="miner" :sector-number="sectorNumber" />
    </v-col>
  </v-row>
</template>

<style scoped lang="scss">

</style>
