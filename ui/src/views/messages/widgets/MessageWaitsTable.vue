<script setup lang="ts">
import { useQuery } from "@vue/apollo-composable"
import { GetMessageWaits } from "@/gql/message"
import { computed, ComputedRef, ref, watchEffect } from "vue"
import { MessageWait } from "@/typed-graph"
import { IconRefresh } from "@tabler/icons-vue"
import { getRelativeTime } from '@/utils/helpers/time'
import MachineSelectInput from '@/components/app/MachineSelectInput.vue'
import TruncatedText from '@/components/shared/TruncatedText.vue'
import InfoDialog from '@/components/shared/InfoDialog.vue'
import JsonViewer from '@/components/shared/JsonViewer.vue'
import StatusIcon from '@/components/shared/StatusIcon.vue'

const props = defineProps({
  waiterMachineId: {
    type: Number,
    default: undefined
  },
  allowSwitchMachine: {
    type: Boolean,
    default: true
  },
  height: {
    type: [Number, String],
    default: 'calc(100vh - 330px)'
  },
})

const localMachineId = ref(props.waiterMachineId)

const limit = ref(100)
const page = ref(1)
const offset = computed(() => (page.value - 1) * limit.value)

const { result, loading, refetch } = useQuery(GetMessageWaits, {
  waiterMachineId: localMachineId,
  offset: offset,
  limit: limit
}, () => ({
  fetchPolicy: 'cache-first',
}))

const items: ComputedRef<MessageWait[]> = computed(() => result.value?.messageWaits || [])

const itemsCount = ref(0)
watchEffect(() => {
  if (result.value?.messageWaitsCount !== undefined) {
    itemsCount.value = result.value.messageWaitsCount
  }
})

const headers = [
  { title: 'Signed Message CID', key: 'signedMessageCid' },
  { title: 'Waiter Machine', key: 'waiterMachine' },
  { title: 'Tipset Epoch', key: 'executedTskEpoch' },
  { title: 'Exit Code', key: 'executedRcptExitcode', align: 'center' },
  { title: 'Gas Used', key: 'executedRcptGasUsed' },
  { title: 'Message Data', key: 'executedMsgData', align: 'center' },
  { title: 'Created At', key: 'createdAt' },
  { title: 'Status', key: 'status', align: 'center' },
] as const

const getExecutionStatus = (item: MessageWait) => {
  if (item.executedRcptExitcode !== null && item.executedRcptExitcode !== undefined) {
    return item.executedRcptExitcode === 0 ? 'success' : 'failure'
  }
  return 'pending'
}

const getExecutionStatusText = (item: MessageWait) => {
  if (item.executedRcptExitcode !== null && item.executedRcptExitcode !== undefined) {
    return item.executedRcptExitcode === 0 ? 'Executed Successfully' : `Failed (Exit Code: ${item.executedRcptExitcode})`
  }
  return 'Pending Execution'
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
              <MachineSelectInput
                v-if="allowSwitchMachine"
                v-model="localMachineId"
                class="c-input"
                label="Machine"
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
        fixed-header
        hover
        :headers="headers"
        :height="props.height"
        :items="items"
        :items-length="itemsCount"
        :loading="loading"
      >
        <template #item.signedMessageCid="{ value }">
          <TruncatedText :text="value" />
        </template>
        <template #item.waiterMachine="{ item }">
          <div v-if="item.waiterMachine">
            <div
              class="text-body-2"
            >
              {{ item.waiterMachine.hostAndPort }}
            </div>
            <div
              class="text-caption text-medium-emphasis"
            >
              ID: {{ item.waiterMachine.id }}
            </div>
          </div>
          <span
            v-else
            class="text-medium-emphasis"
          >
            -
          </span>
        </template>
        <template #item.executedTskEpoch="{ item }">
          <v-tooltip
            v-if="item.executedTskEpoch"
            location="top"
          >
            <template #activator="{ props: tooltipProps }">
              <span
                v-bind="tooltipProps"
                class="cursor-pointer"
              >
                {{ item.executedTskEpoch }}
              </span>
            </template>
            <div>
              <div class="text-caption">
                Tipset CID:
              </div>
              <div class="text-body-2">
                {{ item.executedTskCid || 'N/A' }}
              </div>
            </div>
          </v-tooltip>
          <span
            v-else
            class="text-medium-emphasis"
          >
            -
          </span>
        </template>
        <template #item.executedRcptExitcode="{ value }">
          <v-chip
            v-if="value !== null && value !== undefined"
            :color="value === 0 ? 'success' : 'error'"
            size="small"
            variant="tonal"
          >
            {{ value }}
          </v-chip>
          <span
            v-else
            class="text-medium-emphasis"
          >
            -
          </span>
        </template>
        <template #item.executedRcptGasUsed="{ value }">
          <span v-if="value">{{ value.toLocaleString() }}</span>
          <span
            v-else
            class="text-medium-emphasis"
          >
            -
          </span>
        </template>
        <template #item.executedMsgData="{ value }">
          <InfoDialog v-if="value">
            <JsonViewer
              :data="value"
              title="Executed Message Data"
            />
          </InfoDialog>
          <span
            v-else
            class="text-medium-emphasis"
          >
            -
          </span>
        </template>
        <template #item.createdAt="{ value }">
          {{ getRelativeTime(value, "long") }}
        </template>
        <template #item.status="{ item }">
          <StatusIcon
            :status="getExecutionStatus(item)"
            :tooltip="getExecutionStatusText(item)"
          />
        </template>
      </v-data-table-server>
    </v-card-text>
  </v-card>
</template>

<style scoped lang="scss">
.cursor-pointer {
  cursor: pointer;
}
</style>
