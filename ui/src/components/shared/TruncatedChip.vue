<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
import CopyIcon from './CopyIcon.vue'

const props = defineProps({
  text: {
    type: String,
    default: ''
  },
  maxWidth: {
    type: String,
    default: '150px'
  }
})

const contentRef = ref<HTMLElement | null>(null)
const isOverflowing = ref(false)

const checkOverflow = () => {
  const el = contentRef.value
  if (el) {
    isOverflowing.value = el.scrollWidth > el.clientWidth
  }
}

onMounted(() => {
  nextTick(() => {
    checkOverflow()
  })
})
</script>

<template>
  <v-chip v-bind="$attrs">
    <span
      ref="contentRef"
      class="d-inline-block text-truncate"
      :style="{ 'max-width': props.maxWidth }"
    >
      {{ props.text }}
    </span>

    <CopyIcon
      v-if="isOverflowing"
      :value="props.text"
    />

    <v-tooltip
      v-if="isOverflowing"
      activator="parent"
      location="top"
    >
      {{ props.text }}
    </v-tooltip>
  </v-chip>
</template>
