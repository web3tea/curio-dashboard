<script setup lang="ts">
import { useMutation,useQuery } from '@vue/apollo-composable'
import { ref, computed, PropType } from 'vue'
import { AddMarketClientFilter, GetMarketClientFilters, CheckMarketClientFilter, UpdateMarketClientFilter } from '@/gql/market'
import { IconAlertCircle,IconPlus } from '@tabler/icons-vue'
import { refDebounced } from '@vueuse/core'
import { ClientFilter } from '@/typed-graph'
import { formatBytes } from '@/utils/helpers/formatBytes'
import PriceFilterSelect from './PriceFilterSelect.vue'
import { useNotificationStore } from '@/stores/notification'

const notificationStore = useNotificationStore()
const props = defineProps({
  action: {
    type: String,
    default: 'add',
    validator: (value: string) => ['update', 'add'].includes(value)
  },
  item: {
    type: Object as PropType<ClientFilter>,
    default: () => null
  }
})

const dialog = ref(false)

const name = ref<string>(props.item ? props.item.name : '')
const nameDebounced = refDebounced(name, 1000)
const active = ref<boolean>(props.item ? props.item.active : false)
const wallets = ref<string[]>(props.item ? props.item.wallets : [])
const peers = ref<string[]>(props.item ? props.item.peers : [])
const pricingFilters = ref<string[]>(props.item ? props.item.pricingFilters : [])
const maxDealsPerHour = ref<number>(props.item ? props.item.maxDealsPerHour : 0)
const maxDealSizePerHour = ref<number>(props.item ? props.item.maxDealSizePerHour : 0)
const info = ref<string>(props.item ? props.item.info : '')

const { mutate, loading, onDone, onError } = useMutation(props.action === 'add' ? AddMarketClientFilter: UpdateMarketClientFilter, () => ({
  variables: {
    input: {
      name: name.value,
      active: active.value,
      wallets: wallets.value,
      peers: peers.value,
      pricingFilters: pricingFilters.value,
      maxDealsPerHour: maxDealsPerHour.value,
      maxDealSizePerHour: maxDealSizePerHour.value,
      info: info.value,
    }
  },
  refetchQueries: [{
    query: GetMarketClientFilters,
  }],
  awaitRefetchQueries: true,
}))

onDone(() => {
  dialog.value = false
  name.value = ''
  notificationStore.success(props.action === 'add' ? 'Client filter added successfully' : 'Client filter updated successfully')
})

onError(e => {
  notificationStore.error(e.message)
})

const form = ref()
const handleSubmit = async () => {
  const { valid } = await form.value.validate()
  if (!valid) {
    return
  }
  mutate()
}

const { result: checkResult, loading: checkLoading } = useQuery(CheckMarketClientFilter, {
  name: nameDebounced
})

const exists = computed(() => {
  return !checkLoading.value && !!checkResult.value?.marketCheckPriceFilter
})

const rules = {
  name: [
    (v: string) => !!v || 'Name is required',
    (v: string) => {
      if (props.action === 'add') {
        return !exists.value || `Price filter ${v} already exists`
      }
      return true
    }
  ],
  size: [
    (v: string) => !isNaN(Number(v)) || 'This field must be a number',
    (v: string) => Number(v) >= 256 || 'Size must be at least 256 bytes',
    (v: string) => Number(v) <= 34359738368 || 'Size must not exceed 32GB',
  ]
}

</script>
<template>
  <v-dialog
    v-model="dialog"
    max-width="600"
  >
    <template #activator="{ props: activatorProps }">
      <v-btn
        v-if="action === 'update'"
        color="primary"
        variant="elevated"
        v-bind="activatorProps"
      >
        Update
      </v-btn>
      <v-btn
        v-else
        :icon="IconPlus"
        rounded
        variant="text"
        v-bind="activatorProps"
      />
    </template>

    <v-card
      :loading="loading"
      :prepend-icon="IconAlertCircle"
      :title="props.action === 'add' ? 'Add Client Filter': 'Update Client Filter'"
    >
      <v-card-text>
        <v-form
          ref="form"
          @submit.prevent="handleSubmit"
        >
          <v-row no-gutters>
            <v-col cols="6">
              <v-label class="text-subtitle-1 text-high-emphasis mb-2">
                Name
              </v-label>
              <v-text-field
                v-model="name"
                color="primary"
                :rules="rules.name"
                variant="outlined"
                density="comfortable"
                :disabled="props.action === 'update'"
              />
            </v-col>
            <v-col cols="6">
              <v-label class="text-subtitle-1 text-high-emphasis mb-2">
                Active
              </v-label>
              <v-checkbox
                v-model="active"
                color="primary"
                hide-details
              />
            </v-col>
            <v-col
              cols="12"
            >
              <v-label class="text-subtitle-1 text-high-emphasis mb-2">
                Pricing Filters
              </v-label>
              <PriceFilterSelect v-model="pricingFilters" />
            </v-col>
            <v-col cols="12">
              <v-label class="text-subtitle-1 text-high-emphasis mb-2">
                Wallets
              </v-label>
              <v-text-field
                v-model="wallets"
                color="primary"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="12">
              <v-label class="text-subtitle-1 text-high-emphasis mb-2">
                Peers
              </v-label>
              <v-text-field
                v-model="peers"
                color="primary"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col
              cols="12"
            >
              <v-label class="text-subtitle-1 text-high-emphasis mb-2">
                Max Deals Per Hour
              </v-label>
              <v-text-field
                v-model="maxDealsPerHour"
                color="primary"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="12 mb-2">
              <v-label class="text-subtitle-1 text-high-emphasis mb-2">
                Max Deal Size Per Hour
              </v-label>
              <v-text-field
                v-model="maxDealSizePerHour"
                color="primary"
                :rules="rules.size"
                variant="outlined"
                density="comfortable"
                suffix="Bytes"
                :hint="formatBytes(maxDealSizePerHour).combined"
                persistent-hint
              />
            </v-col>
            <v-col cols="12">
              <v-btn
                variant="plain"
                @click="dialog = false"
              >
                Cancel
              </v-btn>

              <v-btn
                type="submit"
                :loading="loading"
                color="primary"
                variant="elevated"
              >
                {{ props.action === 'add' ? 'Add' : 'Update' }}
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
