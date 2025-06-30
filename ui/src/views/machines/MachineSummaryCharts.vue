<script setup lang="ts">
import { computed, ComputedRef, ref, onActivated, onDeactivated } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { GetMachinesSummary } from '@/gql/machine'
import { MachineSummary } from '@/typed-graph'
import { formatBytes } from '@/utils/helpers/formatBytes'
import { IconBrandSpeedtest, IconCpu, IconServer } from '@tabler/icons-vue'
import { useI18n } from 'vue-i18n'
import { getRelativeTime } from '@/utils/helpers/time'

const { t } = useI18n()

const enabled = ref(true)

const { result } = useQuery(GetMachinesSummary, null, () => ({
  enabled: enabled.value,
  pollInterval: 60000,
}))

onActivated(() => {
  enabled.value = true
})

onDeactivated(() => {
  enabled.value = false
})

const stats: ComputedRef<MachineSummary> = computed(() => result.value?.machineSummary)

const cards = computed(() => [
  { value: stats.value?.total || 0, text: t('fields.Machines'), icon: IconServer, color: 'primary', updatedAt: stats.value?.updatedAt },
  { value: stats.value?.totalCpu || 0, text: t('fields.CPU'), icon: IconCpu, color: 'info', updatedAt: stats.value?.updatedAt },
  { value: stats.value?.totalGpu || 0, text: t('fields.GPU'), icon: IconCpu, color: 'success', updatedAt: stats.value?.updatedAt },
  { value: formatBytes(stats.value?.totalRam || 0).combined, text: t('fields.RAM'), icon: IconBrandSpeedtest, color: 'warning', updatedAt: stats.value?.updatedAt },
])

</script>
<template>
  <v-row>
    <v-col
      v-for="(card, i) in cards"
      :key="i"
      cols="12"
      md="3"
    >
      <v-card elevation="0">
        <v-card variant="outlined">
          <v-card-text>
            <div class="d-flex align-items-center justify-space-between">
              <div>
                <h5 class="text-h5">
                  {{ card.text }}
                </h5>
                <h3 class="text-h3 my-2">
                  {{ card.value }}
                </h3>
                <h6 class="text-caption font-weight-medium mb-0">
                  {{ getRelativeTime(card.updatedAt, "short") }}
                </h6>
              </div>
              <span class="d-flex align-center">
                <v-btn
                  :color="card.color"
                  rounded="md"
                  variant="flat"
                >
                  <v-icon :icon="card.icon" />
                </v-btn>
              </span>
            </div>
          </v-card-text>
        </v-card>
      </v-card>
    </v-col>
  </v-row>
</template>
