<script setup lang="ts">

import { useGlobalStore } from '@/stores/apps/global'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { d } = useI18n()

const props = defineProps({
  epoch: {
    type: [Number, null],
    default: null
  },
  chipColor: {
    type: String,
    default: 'auto',
  },
})

const globalStore = useGlobalStore()

const text = computed(() => {
  if (!props.epoch) {
    return 'N/A'
  }
  return d(globalStore.epochToTime(props.epoch), 'long')
})

</script>

<template>
  <v-tooltip :text="text">
    <template #activator="{ props: props1 }">
      <v-btn v-bind="props1">{{ epoch }}</v-btn>
    </template>
  </v-tooltip>
</template>

<style scoped lang="scss">

</style>
