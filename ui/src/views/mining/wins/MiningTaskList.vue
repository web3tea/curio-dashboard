<script setup lang="ts">
import { useLazyQuery } from '@vue/apollo-composable'
import { computed, ComputedRef, ref } from 'vue'
import { MiningTask } from '@/typed-graph'
import { GetMiningWins } from '@/gql/mining'
import { IconInfoCircle, IconReload, IconSearch } from '@tabler/icons-vue'

const offset = ref(0)
const limit = ref(100)
const spId = ref()
const include = ref(true)

const { result, load, refetch, error } = useLazyQuery(GetMiningWins, {
  miner: spId,
  include,
  limit,
  offset,
}, () => ({
  fetchPolicy: 'cache-first',
}))

const items = ref<MiningTask[]>([])
const current: ComputedRef<[MiningTask]> = computed(() => result.value?.miningWins || [])

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
  if (error.value) {
    done('error')
    return
  }

  if (!current.value.length) {
    done('empty')
  } else {
    items.value.push(...current.value)
    offset.value += current.value.length
    done('ok')
  }
}

const searchValue = ref('')
</script>

<template>
  <v-card class="bg-surface" elevation="0" variant="outlined">
    <v-card-item>
      <v-row class="align-center" justify="space-between">
        <v-col cols="12" md="3">
          <v-text-field
            v-model="searchValue"
            hide-details
            persistent-placeholder
            placeholder="Search"
            type="text"
            variant="outlined"
          >
            <template #prepend-inner>
              <IconSearch :size="14" />
            </template>
          </v-text-field>
        </v-col>
        <v-col cols="12" md="3">
          <div class="d-flex ga-2 justify-end">
            <v-btn
              :icon="IconReload"
              round
              rounded
              variant="text"
              @click="refetch"
            />
          </div>
        </v-col>
      </v-row>
    </v-card-item>
    <v-divider />
    <v-card-text class="pa-0">
      <v-infinite-scroll height="calc(100vh - 250px)" @load="onLoad">
        <v-table hover theme="dark">
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
              <td>{{ item.epoch }}</td>
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
