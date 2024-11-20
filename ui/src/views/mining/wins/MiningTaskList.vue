<script setup lang="ts">
import { useLazyQuery } from '@vue/apollo-composable'
import { computed, ComputedRef, ref, watch } from 'vue'
import { MiningTask } from '@/typed-graph'
import { GetMiningWins } from '@/gql/mining'
import { IconInfoCircle } from '@tabler/icons-vue'
import { useCustomizerStore } from '@/stores/customizer'

const customizer = useCustomizerStore()

const offset = ref(0)
const limit = ref(100)
const selectMiner = ref<string | undefined>(undefined)
const include = ref(true)

const { result, load, loading, refetch, error } = useLazyQuery(GetMiningWins, {
  miner: selectMiner,
  include,
  offset,
  limit,
}, () => ({
  fetchPolicy: 'cache-first',
}))

const items = ref<MiningTask[]>([])
const current: ComputedRef<[MiningTask]> = computed(() => result.value?.miningWins || [])

watch([selectMiner, include], async () => {
  offset.value = 0
  await refetch()
  while (loading.value) {
    await new Promise(resolve => setTimeout(resolve, 500))
  }
  items.value = current.value
}, { flush: 'post' })

const headers = [
  { title: 'ID', key: 'taskId' },
  { title: 'Miner', key: 'spId' },
  { title: 'Epoch', key: 'epoch' },
  { title: 'MinedCid', key: 'minedCid' },
  { title: 'MinedAt', key: 'minedAt' },
  { title: 'SubmittedAt', key: 'submittedAt' },
  { title: 'Included', key: 'included' },
  { title: 'MinedHeader', key: 'minedHeader' },
]

type InfiniteScrollSide = 'start' | 'end' | 'both'
type InfiniteScrollStatus = 'ok' | 'empty' | 'loading' | 'error'

async function onLoad ({ side, done }: { side: InfiniteScrollSide, done: (status: InfiniteScrollStatus) => void }) {
  if (side === 'end') {
    await load()
  }

  while (loading.value) {
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  if (error.value) {
    done('error')
    return
  }

  if (!current.value.length) {
    done('empty')
  } else {
    items.value = [...items.value, ...current.value]
    offset.value += current.value.length
    done('ok')
  }
}

</script>

<template>
  <v-card class="bg-surface" elevation="0" :loading="loading" variant="outlined">
    <v-card-item>
      <v-row class="align-center" justify="space-between">
        <v-col cols="6" md="2">
          <MinerSelectInput v-model="selectMiner" />
        </v-col>
        <v-col cols="6" md="3">
          <v-switch v-model="include" color="primary" :disabled="loading" label="Include" />
        </v-col>
        <v-spacer />
      </v-row>
    </v-card-item>
    <v-divider />
    <v-card-text class="pa-0">
      <v-infinite-scroll height="calc(100vh - 250px)" @load="onLoad">
        <v-table hover :theme="customizer.dark ? 'dark' : 'light'">
          <thead>
            <tr>
              <th v-for="h in headers" :key="h.key" class="text-left">
                {{ h.title }}
              </th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="item in items"
              :key="item.taskId"
            >
              <td>{{ item.taskId }}</td>
              <td>{{ item.spId }}</td>
              <td><EpochField :epoch="item.epoch" /></td>
              <td>{{ item.minedCid }}</td>
              <td>{{ $d(item.minedAt, 'short') }}</td>
              <td>{{ $d(item.submittedAt, 'short') }}</td>
              <td>{{ item.included }}</td>
              <td><v-dialog>
                <template #activator="{ props }">
                  <v-icon color="primary" v-bind="props">
                    <IconInfoCircle />
                  </v-icon>
                </template>
                <template #default="{ }">
                  <v-card>
                    <v-card-text>
                      <pre>
                  {{ JSON.stringify(item.minedHeader , null, 2) }}
                </pre>
                    </v-card-text>
                  </v-card>
                </template>
              </v-dialog></td>
            </tr>
          </tbody>
        </v-table>
      </v-infinite-scroll></v-card-text>
  </v-card>

</template>

<style scoped lang="scss">

</style>
