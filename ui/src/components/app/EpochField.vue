<script setup lang="ts">

import { useGlobalStore } from '@/stores/apps/global'
import { computed } from 'vue'
import { getRelativeTime } from '@/utils/helpers/time'

const props = defineProps({
  epoch: {
    type: [Number, null],
    default: null
  },
  chipColor: {
    type: String,
    default: 'auto',
  },
  defaultText: {
    type: String,
    default: 'N/A',
  }
})

const globalStore = useGlobalStore()

const text = computed(() => {
  if (!props.epoch) {
    return props.defaultText
  }
  return getRelativeTime(globalStore.epochToTime(props.epoch), 'long')
})

</script>

<template>
  <v-tooltip :text="text">
    <template #activator="{ props: pp }">
      <span
        v-bind="pp"
      >
        {{ epoch }}
      </span>
    </template>
  </v-tooltip>
</template>

<style scoped lang="scss">

</style>
