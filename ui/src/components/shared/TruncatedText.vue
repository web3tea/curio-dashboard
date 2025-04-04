<script setup lang="ts">
import { computed } from 'vue'
import CopyIcon from './CopyIcon.vue'

const props = defineProps({
  text: {
    type: String,
    default: ''
  },
  maxLength: {
    type: Number,
    default: 20
  },
  useChip: {
    type: Boolean,
    default: false
  },
  startChars: {
    type: Number,
    default: 10
  },
  endChars: {
    type: Number,
    default: 8
  },
  allowCopy: {
    type: Boolean,
    default: true
  }
})

const needsTruncation = computed(() => {
  if (!props.text) {
    return false
  }
  return props.text.length > props.maxLength
})

const displayText = computed(() => {
  if (!needsTruncation.value) {
    return props.text
  }

  if (props.text.length <= props.startChars + props.endChars + 3) {
    return props.text
  }

  const start = props.text.substring(0, props.startChars)
  const end = props.text.substring(props.text.length - props.endChars)
  return `${start}...${end}`
})

const showCopyIcon = computed(() => {
  return props.allowCopy && needsTruncation.value
})

</script>

<template>
  <v-chip
    v-if="useChip"
    v-bind="$attrs"
  >
    <span>{{ displayText }}</span>

    <CopyIcon
      v-if="showCopyIcon"
      :value="props.text"
    />

    <v-tooltip
      v-if="needsTruncation"
      activator="parent"
      location="top"
    >
      {{ props.text }}
    </v-tooltip>
  </v-chip>

  <div
    v-else
    class="truncated-text-container"
    v-bind="$attrs"
  >
    <span>{{ displayText }}</span>

    <CopyIcon
      v-if="showCopyIcon"
      :value="props.text"
      class="ms-1"
    />

    <v-tooltip
      v-if="needsTruncation"
      activator="parent"
      location="top"
    >
      {{ props.text }}
    </v-tooltip>
  </div>
</template>

<style scoped>
.truncated-text-container {
  display: inline-flex;
  align-items: center;
}
</style>
