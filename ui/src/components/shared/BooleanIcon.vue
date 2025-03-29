
<script setup lang="ts">
import { ref, useSlots, computed } from 'vue'
import { IconCircleCheck, IconCircleX } from '@tabler/icons-vue'

interface BooleanIconProps {
  modelValue: boolean;
  width?: number;
  maxWidth?: string;
}

withDefaults(defineProps<BooleanIconProps>(), {
  modelValue: false,
  width: undefined,
  maxWidth: '80%',
})

const dialogVisible = ref(false)

const slots = useSlots()
const hasDefaultSlot = computed(() => !!slots.default)

const openDialog = () => {
  if (hasDefaultSlot.value) {
    dialogVisible.value = true
  }
}

const closeDialog = () => {
  dialogVisible.value = false
}

defineExpose({
  openDialog,
  closeDialog
})
</script>

<template>
  <div class="boolean-icon">
    <v-icon
      v-if="modelValue"
      :icon="IconCircleCheck"
      color="success"
      :class="{ clickable: hasDefaultSlot }"
      @click="openDialog"
    />

    <v-icon
      v-else
      :icon="IconCircleX"
      color="error"
    />

    <v-dialog
      v-if="modelValue && hasDefaultSlot"
      v-model="dialogVisible"
      :width="width"
    >
      <v-card>
        <v-card-text class="pa-4">
          <slot />
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.boolean-icon {
  display: inline-flex;
  align-items: center;
}

.clickable {
  cursor: pointer;
}
</style>
