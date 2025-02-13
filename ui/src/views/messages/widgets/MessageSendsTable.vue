<script setup lang="ts">
import { useQuery } from "@vue/apollo-composable"
import { GetMessageSends } from "@/gql/message"
import { computed, ComputedRef, ref } from "vue"
import { MessageSend } from "@/typed-graph"
import { IconInfoCircle, IconReload } from "@tabler/icons-vue"
import { useTableSettingsStore } from "@/stores/table"
import { useI18n } from "vue-i18n"

const props = defineProps({
  account: {
    type: String,
    default: undefined
  },
  allowSwitchMiner: {
    type: Boolean,
    default: true
  },
  height: {
    type: [Number, String],
    default: 'calc(100vh - 330px)'
  },
})

const { d } = useI18n()

const tableSettings = useTableSettingsStore()

const localAccount = ref(props.account)

const limit = ref(100)
const page = ref(1)
const offset = computed(() => (page.value - 1) * limit.value)

const { result, loading, refetch } = useQuery(GetMessageSends, {
  account: localAccount,
  offset: offset,
  limit: limit
}, () => ({
  fetchPolicy: 'cache-first',
}))

const items: ComputedRef<[MessageSend]> = computed(() => result.value?.messageSends || [])
const itemsCount: ComputedRef<number> = computed(() => {
  return result.value?.messageSendsCount || itemsCount.value || 0
})

const headers = [
  { title: 'From', key: 'fromKey' },
  { title: 'To', key: 'toAddr' },
  { title: 'Nonce', key: 'nonce' },
  { title: 'Reason', key: 'sendReason' },
  { title: 'TaskID', key: 'sendTaskId' },
  { title: 'Success', key: 'sendSuccess' },
  { title: 'Send Time', key: 'sendTime' },
  { title: 'Signed CID', key: 'signedCid' },
  { title: 'Signed JSON', key: 'signedJson' },
  { title: 'Unsigned CID', key: 'unsignedCid' },
  { title: 'Error', key: 'sendError' },
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
          cols="12"
          md="6"
        >
          <v-row>
            <v-col
              cols="12"
              md="3"
            >
              <MinerSelectInput
                v-if="allowSwitchMiner"
                v-model="localAccount"
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
              :icon="IconReload"
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
        v-model:items-per-page="tableSettings.itemsPerPage"
        :fixed-header="tableSettings.fixedHeader"
        :headers="headers"
        :height="props.height"
        :hover="tableSettings.hover"
        :items="items"
        :items-length="itemsCount"
        :loading="loading"
        :items-per-page-options="tableSettings.itemsPerPageOptions"
      >
        <template #item.fromKey="{ value }">
          <TruncatedChip :text="value" />
        </template>
        <template #item.toAddr="{ value }">
          <TruncatedChip :text="value" />
        </template>
        <template #item.sendTime="{ value }">
          {{ value ? d(value, 'short') : '' }}
        </template>
        <template #item.signedCid="{ value }">
          <TruncatedChip :text="value" />
        </template>
        <template #item.unsignedCid="{ value }">
          <TruncatedChip :text="value" />
        </template>
        <template #item.signedJson="{ value }">
          <v-btn
            v-if="value"
            :icon="true"
            :rounded="true"
            size="x-small"
          >
            <IconInfoCircle />
            <v-dialog activator="parent">
              <v-card>
                <v-card-text>
                  <pre>
                  {{ JSON.stringify(value, null, 2) }}
                </pre>
                </v-card-text>
              </v-card>
            </v-dialog>
          </v-btn>
        </template>
      </v-data-table-server>
    </v-card-text>
  </v-card>
</template>

<style scoped lang="scss">
</style>
