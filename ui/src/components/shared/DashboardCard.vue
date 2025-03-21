<script setup lang="ts">
import { ref, computed } from 'vue'
import { TrendType } from '@/typed-graph'
import { Icon, IconAlertTriangle, IconArrowDown, IconArrowsExchange, IconArrowUp, IconCircleCheck, IconInfoCircle } from '@tabler/icons-vue'
import { useI18n } from 'vue-i18n'

const props = withDefaults(defineProps<{
  title: string;
  tooltip?: string;
  detailsLink?: string;
  detailsText?: string;
  trend?: TrendType;
  trendValue?: string;
}>(), {
  tooltip: '',
  detailsLink: '#',
  detailsText: 'View Details',
  trend: "NORMAL",
  trendValue: undefined
})

const { t } = useI18n()
const emit = defineEmits<(e: 'click', event: MouseEvent) => void>()

const hover = ref<boolean>(false)
const elevation = ref<number>(2)

const handleClick = (event: MouseEvent): void => {
  emit('click', event)
}

const trendIcon = computed<Icon>(() => {
  switch(props.trend) {
  case "UP":
    return IconArrowUp
  case "DOWN":
    return IconArrowDown
  case "WARNING":
    return IconAlertTriangle
  case "GOOD":
    return IconCircleCheck
  default:
    return IconArrowsExchange
  }
})

const trendColor = computed<string>(() => {
  switch(props.trend) {
  case "UP":
    return 'success'
  case "DOWN":
    return 'error'
  case "WARNING":
    return 'warning'
  case "GOOD":
    return 'success'
  default:
    return 'grey'
  }
})
</script>

<template>
  <v-card
    :elevation="elevation"
    :class="{ 'on-hover': hover }"
    class="dashboard-card"
    @mouseover="hover = true"
    @mouseleave="hover = false"
    @click="handleClick"
  >
    <v-card-item>
      <v-card-title class="d-flex align-center justify-space-between text-subtitle-1">
        <span>{{ title }}</span>
        <v-tooltip
          v-if="tooltip"
          location="top"
        >
          <template #activator="{ props:pp }">
            <IconInfoCircle
              color="grey"
              v-bind="pp"
              size="16"
            />
          </template>
          <span>{{ tooltip }}</span>
        </v-tooltip>
      </v-card-title>
    </v-card-item>

    <v-card-text>
      <slot />
    </v-card-text>

    <v-divider />

    <v-card-actions class="d-flex justify-space-between">
      <v-btn
        variant="text"
        density="compact"
        color="primary"
        :to="detailsLink"
      >
        {{ t('common.viewDetails', detailsText) }}
      </v-btn>
      <v-chip
        v-if="trendValue !== undefined"
        :color="trendColor"
        size="small"
        class="ml-2"
      >
        <v-icon
          size="small"
          :icon="trendIcon"
          start
        />
        {{ trendValue }}
      </v-chip>
      <v-icon
        v-else
        size="small"
        :color="trendColor"
        :icon="trendIcon"
      />
    </v-card-actions>
  </v-card>
</template>

<style scoped>
.dashboard-card {
  transition: transform 0.3s, box-shadow 0.3s;
}
.dashboard-card.on-hover {
  transform: translateY(-5px);
}

.dashboard-card .v-card-text {
  min-height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
