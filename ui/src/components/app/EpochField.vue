<script setup lang="ts">

import { useMetadataStore } from '@/stores/apps/metadata'
import { computed } from 'vue'
import { getRelativeTime } from '@/utils/helpers/time'
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
  defaultText: {
    type: String,
    default: 'N/A',
  },
  swap: {
    type: Boolean,
    default: false,
  }
})

const ms = useMetadataStore()

const timeText = computed(() => {
  if (!props.epoch) {
    return props.defaultText
  }
  return getRelativeTime(ms.epochToTime(props.epoch), 'long', 2, d)
})

const displayText = computed(() => {
  if (!props.epoch) {
    return props.defaultText
  }
  return props.swap ? timeText.value : props.epoch
})

const tooltipText = computed(() => {
  if (!props.epoch) {
    return props.defaultText
  }
  return props.swap ? props.epoch : timeText.value
})

</script>

<template>
  <v-tooltip>
    <template #activator="{ props: pp }">
      <span
        v-bind="pp"
      >
        {{ displayText }}
      </span>
    </template>
    {{ tooltipText }}
  </v-tooltip>
</template>

<style scoped lang="scss">

</style>
