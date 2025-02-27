<script setup lang="ts">
import { ref } from 'vue'
import PieceMetadata from './widgets/PieceMetadata.vue'

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
})

const breadcrumbs = ref([
  {
    title: 'Pieces',
    disabled: true,
    to: '#',
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
      <PieceMetadata :id="props.id" />
    </v-col>
  </v-row>
</template>
