<script setup lang="ts">
import useClipboard from 'vue-clipboard3'
import { IconCopy } from '@tabler/icons-vue'
import { useNotificationStore } from '@/stores/notification'

const props = defineProps({
  value: {
    type: String,
    required: true,
  },
})

const notificationStore = useNotificationStore()
const { toClipboard } = useClipboard()

const copy = async () => {
  try {
    await toClipboard(props.value)
    notificationStore.success('Copied to clipboard')
  } catch (e: unknown) {
    notificationStore.error(e instanceof Error ? e.message : String(e))
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
