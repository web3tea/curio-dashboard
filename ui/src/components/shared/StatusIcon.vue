<script setup lang="ts">
import { computed } from 'vue'
import type { PropType } from 'vue'
import {
  IconCheck,
  IconX,
  IconMinus,
  IconCircle,
  IconAlertTriangle,
  IconInfoCircle,
  IconClock
} from '@tabler/icons-vue'
import type { FunctionalComponent, SVGAttributes } from 'vue'

type IconComponent = FunctionalComponent<SVGAttributes>
type StatusType = 'yes' | 'success' | 'no' | 'failure' | 'warning' | 'info' | 'pending'

const STATUS_CONFIG: Record<StatusType, { icon: IconComponent; color: string; label: string }> = {
  yes: {
    icon: IconCheck,
    color: 'primary',
    label: 'Yes'
  },
  success: {
    icon: IconCheck,
    color: 'success',
    label: 'Success'
  },
  no: {
    icon: IconMinus,
    color: 'grey',
    label: 'No'
  },
  failure: {
    icon: IconX,
    color: 'error',
    label: 'Failure'
  },
  warning: {
    icon: IconAlertTriangle,
    color: 'warning',
    label: 'Warning'
  },
  info: {
    icon: IconInfoCircle,
    color: 'info',
    label: 'Info'
  },
  pending: {
    icon: IconClock,
    color: 'grey-darken-1',
    label: 'Pending'
  }
}

const props = defineProps({
  status: {
    type: String as PropType<StatusType>,
    required: true,
    validator: (value: string) =>
      ['yes', 'success', 'no', 'failure', 'warning', 'info', 'pending'].includes(value)
  },
  tooltip: {
    type: String,
    default: ''
  },
  size: {
    type: [String, Number],
    default: 'small'
  },
  customColor: {
    type: String,
    default: ''
  },
  customIcon: {
    type: Object as PropType<IconComponent>,
    default: null
  }
})

const computedSize = computed(() => {
  if (typeof props.size === 'number') return props.size

  const sizeMap: Record<string, number> = {
    'x-small': 16,
    'small': 20,
    'default': 24,
    'medium': 28,
    'large': 32,
    'x-large': 40
  }

  return sizeMap[props.size] || 24
})

const iconComponent = computed(() => {
  if (props.customIcon) return props.customIcon
  return STATUS_CONFIG[props.status]?.icon || IconCircle
})

const iconColor = computed(() => {
  if (props.customColor) return props.customColor
  return STATUS_CONFIG[props.status]?.color || 'grey'
})

const ariaLabel = computed(() => {
  const label = STATUS_CONFIG[props.status]?.label || props.status
  return props.tooltip || `${label}`
})

const isLongTooltip = computed(() => {
  return props.tooltip && props.tooltip.length > 60
})

const tooltipProps = computed(() => {
  const baseProps = {
    location: 'top' as const
  }

  if (isLongTooltip.value) {
    return {
      ...baseProps,
      maxWidth: 300,
      contentClass: 'status-icon-tooltip--long'
    }
  }

  return baseProps
})
</script>

<template>
  <v-tooltip
    v-if="tooltip"
    :text="tooltip"
    v-bind="tooltipProps"
  >
    <template #activator="{ props: activatorProps }">
      <div
        v-bind="activatorProps"
        :aria-label="ariaLabel"
        class="d-inline-flex align-center"
      >
        <v-icon
          :icon="iconComponent"
          :size="computedSize"
          :color="iconColor"
        />
      </div>
    </template>
  </v-tooltip>

  <div
    v-else
    :aria-label="ariaLabel"
    class="d-inline-flex align-center"
  >
    <v-icon
      :icon="iconComponent"
      :size="computedSize"
      :color="iconColor"
    />
  </div>
</template>

<style scoped>
:deep(.status-icon-tooltip--long) {
  white-space: pre-wrap;
  word-wrap: break-word;
  text-align: left;
  line-height: 1.4;
  padding: 12px 16px;
  font-size: 14px;
}
</style>
