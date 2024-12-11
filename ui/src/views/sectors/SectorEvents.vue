<script setup lang="ts">
import { computed, ComputedRef } from 'vue'

import { useQuery } from '@vue/apollo-composable'
import { TaskHistory } from '@/typed-graph'
import moment from 'moment'
import { IconCircleX, IconReload, IconSquareCheck } from '@tabler/icons-vue'
import { GetSectorEvents } from '@/gql/sector'
import UiChildCard from '@/components/shared/UiChildCard.vue'
import { formatDuration } from '@/utils/helpers/formatDuration'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  miner: {
    type: String,
    required: true,
  },
  sectorNumber: {
    type: Number,
    required: true,
  },
})

const { result, loading, refetch } = useQuery(GetSectorEvents, {
  miner: props.miner,
  sectorNumber: props.sectorNumber,
})

const events: ComputedRef<[TaskHistory]> = computed(() => result.value?.sector.events || [])

</script>

<template>
  <UiChildCard :loading="loading" :title="t('fields.Sector Events')">
    <template #action>
      <v-btn
        :icon="IconReload"
        rounded
        variant="text"
        @click="refetch"
      />
    </template>
    <perfect-scrollbar :style="{ 'max-height': '680px' }">
      <v-timeline class="my-1 custom-timeline timeline-icon-circle justify-start px-5" line-color="borderLight" side="end">
        <template v-for="task in events" :key="task.id">
          <v-timeline-item :dot-color="task.result ? 'success' : 'error'" fill-dot>
            <template #icon>
              <component :is="task.result ? IconSquareCheck : IconCircleX" :style="{ fontSize: '16px' }" />
            </template>
            <template #opposite>
              <span class="text-subtitle-2 text-medium-emphasis">{{ moment(task.workEnd).fromNow() }}</span>
            </template>
            <v-card elevation="0">
              <h6 class="text-subtitle-1 mb-0">
                {{ task.name }}
              </h6>
              <span class="text-caption text-lightText">
                <router-link class="text-primary link-hover" to="#">{{ task.completedByHostAndPort }}</router-link>
                completed in {{ formatDuration((new Date(task.workEnd).getTime() - new Date(task.workStart).getTime())) }}
              </span>
            </v-card>
          </v-timeline-item>
        </template>
      </v-timeline>
    </perfect-scrollbar>
  </UiChildCard>

</template>
