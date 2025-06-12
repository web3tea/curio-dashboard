<script setup lang="ts">
import { useQuery } from "@vue/apollo-composable"
import { GetWdpostProofs } from "@/gql/wdpost"
import { computed, ComputedRef, ref, watchEffect } from "vue"
import { WdpostProofs } from "@/typed-graph"
import { IconRefresh } from "@tabler/icons-vue"
import MinerSelectInput from '@/components/app/MinerSelectInput.vue'
import TruncatedText from '@/components/shared/TruncatedText.vue'
import StatusIcon from '@/components/shared/StatusIcon.vue'
import EpochField from '@/components/app/EpochField.vue'

const props = defineProps({
  height: {
    type: [Number, String],
    default: 'calc(100vh - 330px)'
  },
})

const selectedMiner = ref<string>()

const limit = ref(100)
const page = ref(1)
const offset = computed(() => (page.value - 1) * limit.value)

const { result, loading, refetch } = useQuery(GetWdpostProofs, {
  spId: selectedMiner,
  offset: offset,
  limit: limit
}, () => ({
  fetchPolicy: 'cache-first',
}))

const items: ComputedRef<WdpostProofs[]> = computed(() => result.value?.wdpostProofs || [])

const itemsCount = ref(0)
watchEffect(() => {
  if (result.value?.wdpostProofsCount !== undefined) {
    itemsCount.value = result.value.wdpostProofsCount
  }
})

const headers = [
  { title: 'SP ID', key: 'spId' },
  { title: 'Proving Period', key: 'provingPeriodStart' },
  { title: 'Deadline', key: 'deadline' },
  { title: 'Partition', key: 'partition' },
  { title: 'Submit At', key: 'submitAtEpoch' },
  { title: 'Submit By', key: 'submitByEpoch' },
  { title: 'Task ID', key: 'submitTaskId' },
  { title: 'Message CID', key: 'messageCid' },
  { title: 'Status', key: 'status', align: 'center' },
] as const

const getProofStatus = (item: WdpostProofs) => {
  if (item.messageCid) {
    return 'success'
  } else if (item.submitTaskId) {
    return 'warning'
  } else {
    return 'pending'
  }
}

const getProofStatusText = (item: WdpostProofs) => {
  if (item.messageCid) {
    return 'Submitted'
  } else if (item.submitTaskId) {
    return 'Pending'
  } else {
    return 'Not Started'
  }
}

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
          cols="12"
          md="6"
        >
          <v-row>
            <v-col
              cols="12"
              md="4"
              class="c-input-container"
            >
              <MinerSelectInput
                v-model="selectedMiner"
                class="c-input"
                label="Storage Provider"
                clearable
              />
            </v-col>
          </v-row>
        </v-col>
        <v-col
          cols="12"
          md="3"
        >
          <div class="d-flex ga-2 justify-end">
            <v-btn
              :icon="IconRefresh"
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
      <v-data-table-server
        v-model:page="page"
        v-model:items-per-page="limit"
        :items-per-page-options="[25, 50, 100, 200]"
        fixed-header
        hover
        :headers="headers"
        :height="props.height"
        :items="items"
        :items-length="itemsCount"
        :loading="loading"
      >
        <template #item.spId="{ value }">
          <router-link :to="{ name: 'MinerDetails', params: { id: value } }">
            {{ value }}
          </router-link>
        </template>
        <template #item.provingPeriodStart="{ value }">
          <EpochField :epoch="value" />
        </template>
        <template #item.submitAtEpoch="{ value }">
          <EpochField
            :epoch="value"
            swap
          />
        </template>
        <template #item.submitByEpoch="{ value }">
          <EpochField
            :epoch="value"
            swap
          />
        </template>
        <template #item.submitTaskId="{ value }">
          <span v-if="value">{{ value }}</span>
          <span
            v-else
            class="text-medium-emphasis"
          >
            -
          </span>
        </template>
        <template #item.messageCid="{ value }">
          <TruncatedText
            v-if="value"
            :text="value"
          />
          <span
            v-else
            class="text-medium-emphasis"
          >
            -
          </span>
        </template>
        <template #item.status="{ item }">
          <StatusIcon
            :status="getProofStatus(item)"
            :tooltip="getProofStatusText(item)"
          />
        </template>
      </v-data-table-server>
    </v-card-text>
  </v-card>
</template>

<style scoped lang="scss">

</style>
