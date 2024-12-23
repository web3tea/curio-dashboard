<script setup lang="ts">
import { computed } from 'vue'
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

const { result } = useQuery(GetMiningCountSummaryWithPrevious, {
  start: props.start,
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
  <v-card variant="outlined" class="bg-surface">
    <v-card-text>
        <v-row>
          <v-col v-for="(card, index) in cards" :key="index" cols="12" md="3" sm="6">
              <v-card variant="outlined">
                <v-card-text>
                  <div class="d-flex align-start justify-space-between">
                    <div>
                      <h6 class="text-subtitle-1">{{ card.title }}</h6>
                      <h5 class="text-h5 mb-0">{{ card.value }}</h5>
                      <span class="text-lightText text-caption pt-2">
                        {{ $d(props.start, 'toShortDay') }} - {{ $d(props.end, 'toShortDay') }}
                      </span>
                    </div>
                    <div class="d-flex align-center">
                      <IconCaretDown v-if="card.percentage < 0" color="red" size="16"/>
                      <IconCaretUpDown v-else-if="card.percentage === 0" color="gray" size="16"/>
                      <IconCaretUp v-else color="green" size="16"/>
                      <h5 class="text-h5 text-lightText mb-0 ml-1">{{ card.percentage.toFixed(2) }}%</h5>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
          </v-col>
        </v-row>
      <TabCardChart :start="start" :end="end" :miner="miner" />
    </v-card-text>
  </v-card>
</template>
<style lang="scss">

</style>
