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
  }
})

const ms = useMetadataStore()

const text = computed(() => {
  if (!props.epoch) {
    return props.defaultText
  }
  return getRelativeTime(ms.epochToTime(props.epoch), 'long', 2, d)
})

</script>

<template>
  <v-tooltip>
    <template #activator="{ props: pp }">
      <span
        v-bind="pp"
      >
        {{ epoch }}
      </span>
    </template>
    {{ text }}
  </v-tooltip>
</template>

<style scoped lang="scss">

</style>
