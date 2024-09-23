<script setup lang="ts">

import { ref } from 'vue'
import MinerInfo from '@/views/miners/MinerInfo.vue'

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
})

const breadcrumbs = ref([
  {
    title: 'Miners',
    disabled: false,
    href: '/app/miners',
  },
  {
    title: props.id,
    disabled: true,
    href: '#',
  },
])

</script>

<template>
  <BaseBreadcrumb :breadcrumbs="breadcrumbs" />
  <v-row>
    <v-col cols="12">
      <MinerInfo :id="props.id" />
    </v-col>
  </v-row>
</template>

<style scoped lang="scss">

</style>
