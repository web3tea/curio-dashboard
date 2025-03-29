<script setup lang="ts">
import { ref, watch } from 'vue'
import { IconInfoCircle } from '@tabler/icons-vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

interface InfoDialogProps {
  modelValue?: boolean;
  maxWidth?: string;
}

const props = withDefaults(defineProps<InfoDialogProps>(), {
  modelValue: false,
  maxWidth: '80%',
})

const emit = defineEmits<(e: 'update:modelValue', value: boolean) => void>()

const dialogVisible = ref(props.modelValue)

const openDialog = (): void => {
  dialogVisible.value = true
  emit('update:modelValue', true)
}

const close = (): void => {
  dialogVisible.value = false
  emit('update:modelValue', false)
}

watch(
  () => props.modelValue,
  (newVal) => {
    dialogVisible.value = newVal
  }
)

defineExpose({
  open: openDialog,
  close
})
</script>

<template>
  <div>
    <v-icon
      :icon="IconInfoCircle"
      color="info"
      class="cursor-pointer"
      @click="openDialog"
    />

    <v-dialog
      v-model="dialogVisible"
      :max-width="maxWidth"
      @update:model-value="$emit('update:modelValue', $event)"
    >
      <v-card>
        <v-card-text class="pa-4">
          <slot />
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            variant="text"
            @click="close"
          >
            {{ t('common.Close') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
