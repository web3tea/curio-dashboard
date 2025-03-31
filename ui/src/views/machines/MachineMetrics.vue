<script setup lang="ts">
import { useQuery } from '@vue/apollo-composable'
import { GetMachineInfo } from '@/gql/machine'
import UiChildCard from '@/components/shared/UiChildCard.vue'
import { computed } from 'vue'
import moment from 'moment'
import { formatBytes } from '@/utils/helpers/formatBytes'
import { IconReload } from '@tabler/icons-vue'
import { useI18n } from 'vue-i18n'
import { getRelativeTime } from '@/utils/helpers/time'

const { t } = useI18n()

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
})

const { result, loading, refetch, error } = useQuery(GetMachineInfo, {
  id: props.id,
}, () => ({
  fetchPolicy: 'cache-first',
}))

const details = computed(() => {
  const machine = result.value?.machine
  const metrics = machine?.metrics
  const details = machine?.detail
  const res = [
    { title: 'ID', subtext: machine?.id, cols: 6, sm: 3 },
    { title: 'Name', subtext: details?.name || 'N/A', cols: 6, sm: 3 },
    { title: 'Host', subtext: machine?.hostAndPort, cols: 6, sm: 3 },
    { title: 'Last Contact', subtext: moment(machine?.lastContact).fromNow(), cols: 6, sm: 3 },
    { title: 'Startup', subtext: getRelativeTime(details?.startupTime, 'long'), cols: 6, sm: 3 },
    { title: 'CPU Usage', subtext: `${metrics?.cpuUsage} / ${machine?.cpu}`, cols: 6, sm: 3 },
    { title: 'GPU Usage', subtext: `${metrics?.gpuUsage} / ${machine?.gpu}`, cols: 6, sm: 3 },
    { title: 'RAM Usage', subtext: `${formatBytes(metrics?.ramUsage).combined} / ${formatBytes(machine?.ram).combined}`, cols: 6, sm: 3 },
  ]
  if (metrics) {
    res.push(
      { title: 'Go Routines', subtext: metrics.goRoutines, cols: 6, sm: 3 },
      { title: 'Go Version', subtext: metrics.goVersion, cols: 6, sm: 3 },
      { title: 'Go Threads', subtext: metrics.goThreads, cols: 6, sm: 3 },
      { title: 'Process CPU Seconds Total', subtext: metrics.processCpuSecondsTotal, cols: 6, sm: 3 },
      { title: 'Process Start Time', subtext: getRelativeTime(metrics.processStartTimeSeconds * 1000, 'long'), cols: 6, sm: 3 },
      { title: 'Process Virtual Memory', subtext: formatBytes(metrics.processVirtualMemoryBytes).combined, cols: 6, sm: 3 },
      { title: 'Process Resident Memory Bytes', subtext: formatBytes(metrics.processResidentMemoryBytes).combined, cols: 6, sm: 3 },
      { title: 'Process Open FDs', subtext: metrics.processOpenFds, cols: 6, sm: 3 },
      { title: 'Metrics', subtext: `http://${machine.hostAndPort}/debug/metrics`, cols: 6, sm: 3 },
    )
  }
  res.push(
    { title: 'Layers', subtext: details?.layers.split(','), cols: 12, sm: 12 },
    { title: 'Miners', subtext: details?.miners.split(','), cols: 12, sm: 12 },
    { title: 'Support Tasks', subtext: details?.tasks.split(','), cols: 12, sm: 12 },
  )
  return res
})

function isURL(str: string | undefined | null): boolean {
  if (!str) return false
  try {
    return str.startsWith('http://') ||
      str.startsWith('https://')
  } catch {
    return false
  }
}

</script>

<template>
  <UiChildCard
    :loading="loading"
    :title="t('fields.Basic Info')"
  >
    <template #action>
      <v-btn
        :icon="IconReload"
        rounded
        variant="text"
        @click="refetch"
      />
    </template>
    <v-row class="py-2 mx-0 details-content">
      <v-col
        v-for="(detail, i) in details"
        :key="i"
        class="px-0 pb-0"
        :cols="detail.cols"
        :sm="detail.sm"
      >
        <p class="text-h6 text-lightText mb-1">
          {{ detail.title }}
        </p>
        <p class="text-h6 mb-2">
          <template v-if="Array.isArray(detail.subtext)">
            <v-chip
              v-for="(item, index) in detail.subtext"
              :key="index"
              class="mr-1 mt-1"
              label
              density="compact"
            >
              {{ item }}
            </v-chip>
          </template>
          <template v-else-if="isURL(detail.subtext?.toString())">
            <a
              :href="detail.subtext?.toString()"
              target="_blank"
              rel="noopener noreferrer"
            >{{ detail.subtext }}</a>
          </template>
          <template v-else>
            {{ detail.subtext }}
          </template>
        </p>
        <v-divider />
      </v-col>
      <v-col v-if="error">
        <p class="text-h6 text-lightText mb-1">
          {{ error }}
        </p>
      </v-col>
    </v-row>
  </uichildcard>
</template>

<style scoped lang="scss">

</style>
