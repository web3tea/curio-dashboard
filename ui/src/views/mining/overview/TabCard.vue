<script setup lang="ts">
import { computed, ref } from 'vue'
import { IconCaretDown, IconCaretUp, IconCaretUpDown } from "@tabler/icons-vue"
import { useQuery } from "@vue/apollo-composable"
import { GetMiningCountSummaryWithPrevious } from "@/gql/mining"
import TabCardChart from "@/views/mining/overview/TabCardChart.vue"

const props = defineProps({
  start: {
    type: Date,
    default: new Date(new Date().setDate(new Date().getDate() - 1))
  },
  end: {
    type: Date,
    default: new Date()
  },
  miner: {
    type: String,
    default: undefined
  },
})

const items = ref(['Today', 'Last 7 days', 'Last 30 days'])
const selected = ref('Today')

const realStart = computed(() => {
  switch (selected.value) {
  case 'Today':
    return new Date(new Date().setHours(0, 0, 0, 0))
  case 'Last 7 days':
    return new Date(new Date().setDate(new Date().getDate() - 7))
  case 'Last 30 days':
    return new Date(new Date().setDate(new Date().getDate() - 30))
  default:
    return props.start
  }
})

const { result, loading } = useQuery(GetMiningCountSummaryWithPrevious, {
  start: realStart,
  end: props.end,
  miner: props.miner
}, () => ({
  fetchPolicy: 'cache-first'
})
)

const cards = computed(() => {
  const summary = result.value?.miningCountSummary || {}
  const previous = summary.previous || {}

  const createCard = (title: string, value: number, prevValue: number) => ({
    title,
    value: value || 0,
    percentage: prevValue ? (value / prevValue) : 0
  })

  return [
    createCard('Total Tasks', summary.total, previous.total),
    createCard('Won Blocks', summary.won, previous.won),
    createCard('Valid Blocks', summary.included, previous.included),
    createCard('Orphan Blocks', summary.won - summary.included, previous.won - previous.included)
  ]
})

</script>

<template>
  <UiWidgetCard
    title="Mining"
    :loading="loading"
  >
    <template #append>
      <v-autocomplete
        id="autocomplete-input"
        v-model="selected"
        :items="items"
        color="primary"
        variant="outlined"
        hide-details
        min-width="160"
        density="compact"
      />
    </template>
    <v-row class="justify-sm-space-between justify-center py-5 px-4">
      <v-col
        v-for="(card, index) in cards"
        :key="index"
        cols="12"
        md="3"
        sm="6"
      >
        <v-card variant="outlined">
          <v-card-text>
            <div class="d-flex align-start justify-space-between">
              <div>
                <h6 class="text-subtitle-1">
                  {{ card.title }}
                </h6>
                <h5 class="text-h5 mb-0">
                  {{ card.value }}
                </h5>
                <span class="text-lightText text-caption pt-2">
                  {{ $d(props.start, 'toShortDay') }} - {{ $d(props.end, 'toShortDay') }}
                </span>
              </div>
              <div class="d-flex align-center">
                <IconCaretDown
                  v-if="card.percentage < 0"
                  color="red"
                  size="16"
                />
                <IconCaretUpDown
                  v-else-if="card.percentage === 0"
                  color="gray"
                  size="16"
                />
                <IconCaretUp
                  v-else
                  color="green"
                  size="16"
                />
                <h5 class="text-h5 text-lightText mb-0 ml-1">
                  {{ card.percentage.toFixed(2) }}%
                </h5>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <TabCardChart
      :start="realStart"
      :end="props.end"
      :miner="props.miner"
    />
  </UiWidgetCard>
</template>
<style lang="scss">

</style>
