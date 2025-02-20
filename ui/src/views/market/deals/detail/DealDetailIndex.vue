<script setup lang="ts">
import { ref } from 'vue'
import DealInfo from './widgets/DealInfo.vue'

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
})

const breadcrumbs = ref([
  {
    title: 'Deals',
    disabled: true,
    to: '#',
  },
  {
    title: 'MK12 Deals',
    disabled: false,
    to: { name: 'MarketMk12Deals' },
  },
  {
    title: props.id,
    disabled: true,
    to: '#',
  },
])
</script>
<template>
  <BaseBreadcrumb :breadcrumbs="breadcrumbs" />
  <v-row>
    <v-col
      cols="12"
    >
      <DealInfo :id="props.id" />
    </v-col>
  </v-row>
</template>
