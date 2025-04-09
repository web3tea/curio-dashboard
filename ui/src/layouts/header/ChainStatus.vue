<script setup lang="ts">
import { watch, ref, computed, onMounted, onUnmounted } from 'vue'
import { useSubscription } from '@vue/apollo-composable'
import { SubscribeChainHead } from './graphql'
import { getRelativeTime } from '@/utils/helpers/time'
import { IconCube, IconClock } from '@tabler/icons-vue'
import { useI18n } from 'vue-i18n'
import { useUIStore } from '@/stores/ui'
import { storeToRefs } from 'pinia'
import { ChainHead } from '@/typed-graph'

const uiStore = useUIStore()
const { isOnline } = storeToRefs(uiStore)

const { d } = useI18n()

const { result, loading } = useSubscription(SubscribeChainHead, {})

const chainHead = ref<ChainHead | null>(null)
const prevHeight = ref(null)
const heightUpdated = ref(false)
const timeUpdateInterval = ref<ReturnType<typeof setInterval> | null>(null)

const statusColor = computed(() => {
  if (!isOnline.value) return 'error'
  if (!chainHead.value) return 'grey'

  const timestamp = new Date(chainHead.value.timestamp * 1000).getTime()
  const now = Date.now()
  const diffMinutes = (now - timestamp) / (1000 * 60)

  if (diffMinutes < 1) return 'success'
  if (diffMinutes < 3) return 'warning'
  return 'error'
})

const relativeTime = computed(() => {
  if (!chainHead.value) return ''
  return getRelativeTime(chainHead.value.timestamp * 1000)
})

const setupTimeUpdater = () => {
  if (timeUpdateInterval.value) {
    clearInterval(timeUpdateInterval.value)
  }

  timeUpdateInterval.value = setInterval(() => {
    if (chainHead.value) {
      const temp = { ...chainHead.value }
      chainHead.value = temp
    }
  }, 1000)
}

watch(
  result,
  data => {
    if (chainHead.value && data.chainHead.height !== chainHead.value.height) {
      prevHeight.value = chainHead.value.height
      heightUpdated.value = true

      // Reset animation flag after animation completes
      setTimeout(() => {
        heightUpdated.value = false
      }, 2000)
    }

    chainHead.value = data.chainHead

    setupTimeUpdater()
  },
)

onMounted(() => {
  setupTimeUpdater()
})

onUnmounted(() => {
  if (timeUpdateInterval.value) {
    clearInterval(timeUpdateInterval.value)
  }
})
</script>

<template>
  <div class="chain-status-container d-flex align-center py-1 px-2">
    <v-progress-circular
      v-if="loading"
      indeterminate
      size="20"
      width="2"
      color="primary"
      class="mr-2"
    />
    <template v-else>
      <div class="status-indicator-wrapper d-flex align-center mr-2">
        <v-badge
          :color="statusColor"
          dot
          class="status-dot"
          bordered
        />
      </div>

      <div class="d-flex align-center height-container mr-3">
        <v-icon
          :icon="IconCube"
          size="x-small"
          class="mr-1 text-subdued"
        />
        <span
          class="chain-text font-weight-medium text-subdued"
          :class="[heightUpdated ? 'height-updated' : '']"
        >
          {{ chainHead?.height || '...' }}
        </span>
        <v-fade-transition>
          <span
            v-if="heightUpdated && prevHeight"
            class="prev-height text-disabled text-caption"
          >
            +{{ chainHead?.height - prevHeight }}
          </span>
        </v-fade-transition>
      </div>

      <div class="d-flex align-center">
        <v-icon
          :icon="IconClock"
          size="x-small"
          class="mr-1 text-subdued"
        />
        <div class="time-display">
          <v-tooltip location="bottom">
            <template #activator="{ props }">
              <span
                class="chain-text text-subdued"
                v-bind="props"
              >
                {{ relativeTime }}
              </span>
            </template>
            <span>{{ d(chainHead?.timestamp * 1000, 'long') }}</span>
          </v-tooltip>
        </div>
      </div>
    </template>
  </div>
</template>
<style scoped>
.chain-status-container {
  transition: all 0.3s ease;
  max-height: 36px;
  border-left: none;
  position: relative;
  margin-left: 12px;
  padding-left: 12px;
}

.chain-status-container::before {
  content: '';
  position: absolute;
  left: 0;
  top: 25%;
  height: 50%;
  width: 1px;
  background: rgba(var(--v-theme-on-surface), 0.08);
}

.chain-status-container:hover .chain-text {
  color: var(--v-theme-primary);
}

.chain-text {
  font-size: 0.85rem;
  transition: all 0.3s ease;
}

.text-subdued {
  color: rgba(var(--v-theme-on-surface), 0.62) !important;
}

.height-container {
  position: relative;
  min-width: 60px;
}

.height-updated {
  animation: pop 1s ease;
}

.prev-height {
  position: absolute;
  top: -12px;
  right: -8px;
  opacity: 0.8;
  font-size: 0.7rem;
  animation: fadeUp 2s ease forwards;
}

.status-indicator-wrapper {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.status-dot {
  opacity: 0.8;
  transition: opacity 0.3s ease;
  position: relative;
}

.status-dot:deep(.v-badge__badge) {
  position: static;
  transform: none;
  height: 8px;
  width: 8px;
  min-width: 8px;
  min-height: 8px;
  border: none !important;
  box-shadow: none !important;
}

.time-display {
  min-width: 70px;
}

@keyframes pop {
  0% { transform: scale(1); }
  50% { transform: scale(1.25); color: var(--v-theme-primary); }
  100% { transform: scale(1); }
}

@keyframes fadeUp {
  0% { opacity: 0; transform: translateY(0); }
  20% { opacity: 1; }
  80% { opacity: 0.8; transform: translateY(-10px); }
  100% { opacity: 0; transform: translateY(-15px); }
}
</style>
