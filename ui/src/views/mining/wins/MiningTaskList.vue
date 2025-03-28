<script setup lang="ts">
import { computed, ComputedRef, ref } from 'vue'
import { MiningTask } from '@/typed-graph'
import { GetMiningWins } from '@/gql/mining'
import { useQuery } from '@vue/apollo-composable'
import { IconInfoCircle } from '@tabler/icons-vue'
import { useTableSettingsStore } from "@/stores/table"
import { useI18n } from 'vue-i18n'

const props = defineProps({
  start: {
    type: Date,
    default: undefined
  },
  end: {
    type: Date,
    default: undefined
  },
  miner: {
    type: String,
    default: undefined
  },
  include: {
    type: Boolean,
    default: true,
  },
})

const { d } = useI18n()
const tableSettings = useTableSettingsStore()

const page = ref(1)
const limit = ref(100)
const offset = computed(() => (page.value - 1) * limit.value)
const start = ref<Date | undefined>(props.start)
const end = ref<Date | undefined>(props.end)
const selectMiner = ref(props.miner)
const include = ref(props.include)

const selectDateRange = computed({
  get: () => [start.value, end.value].filter(Boolean),
  set: value => {
    if (value) {
      if (value.length === 1) {
        if (value[0]) {
          start.value = value[0]
          end.value = new Date(start.value.getTime() + 24 * 60 * 60 * 1000) // +1 day
        }
      } else {
        start.value = value[0]
        end.value = value[value.length - 1]
      }
    }
  },
})

const { result, loading } = useQuery(GetMiningWins, {
  miner: selectMiner,
  start,
  end,
  include,
  offset,
  limit,
}, () => ({
  fetchPolicy: 'cache-first',
}))

const items: ComputedRef<[MiningTask]> = computed(() => result.value?.miningWins || [])
const itemsCount = computed<number>((): number => {
  return result.value?.miningWinsCount || itemsCount.value || 0
})

const headers = [
  { title: 'ID', key: 'taskId', sortable: false },
  { title: 'Miner', key: 'spId', sortable: false },
  { title: 'Epoch', key: 'epoch', sortable: false },
  { title: 'MinedCid', key: 'minedCid', sortable: false },
  { title: 'MinedAt', key: 'minedAt', sortable: false },
  { title: 'SubmittedAt', key: 'submittedAt', sortable: false },
  { title: 'Included', key: 'included', sortable: false, align: 'center' },
  { title: 'MinedHeader', key: 'minedHeader', sortable: false, align: 'center' },
]

</script>

<template>
  <v-card
    class="bg-surface"
    elevation="0"
    variant="outlined"
  >
    <v-card-item>
      <v-row
        class="align-center"
        justify="space-between"
      >
        <v-col
          cols="6"
          md="2"
        >
          <MinerSelectInput v-model="selectMiner" />
        </v-col>
        <v-col
          cols="6"
          md="3"
        >
          <DateRangeSelectInput
            v-model="selectDateRange"
            label="Date Range"
          />
        </v-col>
        <v-col
          cols="6"
          md="2"
        >
          <v-switch
            v-model="include"
            color="primary"
            :disabled="loading"
            label="Valid"
          />
        </v-col>
        <v-spacer />
      </v-row>
    </v-card-item>
    <v-divider />
    <v-card-text class="pa-0">
      <v-data-table-server
        v-model:items-per-page="tableSettings.itemsPerPage"
        v-model:page="page"
        :fixed-header="tableSettings.fixedHeader"
        :headers="headers"
        height="calc(100vh - 300px)"
        :hover="tableSettings.hover"
        :items="items"
        :items-length="itemsCount"
        :loading="loading"
        :items-per-page-options="tableSettings.itemsPerPageOptions"
      >
        <template #item.spId="{ value }">
          <RouterLink :to="{ name: 'MinerDetails', params: { id: value } }">
            {{ value }}
          </RouterLink>
        </template>
        <template #item.epoch="{ value }">
          <EpochField :epoch="value" />
        </template>
        <template #item.minedCid="{ value }">
          <TruncatedText :text="value" />
        </template>
        <template #item.minedAt="{value}">
          {{ d(value, 'long') }}
        </template>
        <template #item.submittedAt="{value}">
          {{ d(value, 'long') }}
        </template>
        <template #item.minedHeader="{value}">
          <v-dialog>
            <template #activator="{ props:p1 }">
              <v-icon
                v-bind="p1"
              >
                <IconInfoCircle size="18" />
              </v-icon>
            </template>
            <template #default="{ }">
              <JsonViewer
                :data="value"
                title="Mined Header"
              />
            </template>
          </v-dialog>
        </template>
      </v-data-table-server>
    </v-card-text>
  </v-card>
</template>

<style scoped lang="scss">

</style>
