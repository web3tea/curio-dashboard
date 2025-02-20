<script setup lang="ts">
import useClipboard from 'vue-clipboard3'
import { IconCopy } from '@tabler/icons-vue'
import { useUIStore } from '@/stores/ui'

const props = defineProps({
  value: {
    type: String,
    required: true,
  },
})

const { toClipboard } = useClipboard()
const uiStore = useUIStore()

const copy = async () => {
  try {
    await toClipboard(props.value)
    uiStore.appendMsg({
      type: 'success',
      msg: 'Copied to clipboard',
    })
  } catch (e: unknown) {
    uiStore.appendMsg({
      type: 'error',
      msg: e instanceof Error ? e.message : String(e),
    })
  }
}
</script>
<template>
  <v-btn
    size="small"
    :icon="IconCopy"
    variant="text"
    @click="copy"
  />
</template>
