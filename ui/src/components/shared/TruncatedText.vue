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
    default: undefined
  },
  endChars: {
    type: Number,
    default: undefined
  },
  ellipsis: {
    type: String,
    default: '...'
  },
  balanceRatio: {
    type: Number,
    default: 0.5 // Default to equal balance between start and end
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

// Calculate optimal startChars and endChars based on maxLength and balanceRatio
const effectiveStartChars = computed(() => {
  if (props.startChars !== undefined) {
    return props.startChars
  }
  
  if (!needsTruncation.value) {
    return props.text?.length || 0
  }
  
  // Calculate available characters after accounting for ellipsis
  const availableChars = props.maxLength - props.ellipsis.length
  if (availableChars <= 0) return 0
  
  // Apply balance ratio to determine start chars
  return Math.floor(availableChars * props.balanceRatio)
})

const effectiveEndChars = computed(() => {
  if (props.endChars !== undefined) {
    return props.endChars
  }
  
  if (!needsTruncation.value) {
    return 0
  }
  
  // Calculate available characters after accounting for ellipsis
  const availableChars = props.maxLength - props.ellipsis.length
  if (availableChars <= 0) return 0
  
  // Remaining chars go to the end portion
  return Math.max(0, availableChars - effectiveStartChars.value)
})

const displayText = computed(() => {
  if (!props.text) {
    return ''
  }
  
  if (!needsTruncation.value) {
    return props.text
  }

  // Total characters we'd show with ellipsis
  const totalDisplayChars = effectiveStartChars.value + effectiveEndChars.value + props.ellipsis.length
  
  // If the total length would be longer than or equal to original text, just show original
  if (totalDisplayChars >= props.text.length || props.text.length <= props.maxLength) {
    return props.text
  }

  const start = props.text.substring(0, effectiveStartChars.value)
  const end = effectiveEndChars.value > 0 
    ? props.text.substring(props.text.length - effectiveEndChars.value) 
    : ''
    
  return `${start}${props.ellipsis}${end}`
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
