<script setup lang="ts">
import { useMutation, useQuery } from '@vue/apollo-composable'
import { ref, computed, PropType } from 'vue'
import { SetMarketClientAllow, GetMarketClientAllowList, GetMarketClientAllow } from '@/gql/market'
import { IconAlertCircle,IconPlus } from '@tabler/icons-vue'
import { refDebounced } from '@vueuse/core'
import { MarketAllowFilter } from '@/typed-graph'
import { useNotificationStore } from '@/stores/notification'

const notificationStore = useNotificationStore()
const props = defineProps({
  action: {
    type: String,
    default: 'add',
    validator: (value: string) => ['update', 'add'].includes(value)
  },
  item: {
    type: Object as PropType<MarketAllowFilter>,
    default: () => null
  }
})

const dialog = ref(false)

const wallet = ref<string>(props.item ? props.item.wallet : '')
const walletDebounced = refDebounced(wallet, 1000)
const status = ref<boolean>(props.item ? props.item.status : false)

const { mutate, loading, onDone, onError } = useMutation(SetMarketClientAllow, () => ({
  variables: {
    wallet: wallet.value,
    status: status.value,
  },
  refetchQueries: [{
    query: GetMarketClientAllowList,
  }],
  awaitRefetchQueries: true,
}))

onDone(() => {
  dialog.value = false
  notificationStore.success(props.action === 'add' ? 'Client Allow added successfully' : 'Client Allow updated successfully')
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

const { result: checkResult, loading: checkLoading } = useQuery(GetMarketClientAllow, {
  wallet: walletDebounced
})

const exists = computed(() => {
  return !checkLoading.value && Boolean(checkResult.value?.marketAllowFilter)
})

const rules = {
  wallet: [
    (v: string) => !!v || 'Wallet is required',
    (v: string) => {
      if (props.action === 'add') {
        return !exists.value || `Client Allow ${v} already exists`
      }
      return true
    }
  ],
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
      :title="props.action === 'add' ? 'Add Client Allow': 'Update Client Allow'"
    >
      <v-card-text>
        <v-form
          ref="form"
          @submit.prevent="handleSubmit"
        >
          <v-row no-gutters>
            <v-col cols="6">
              <v-label class="text-subtitle-1 text-high-emphasis mb-2">
                Wallet
              </v-label>
              <v-text-field
                v-model="wallet"
                color="primary"
                :rules="rules.wallet"
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
                v-model="status"
                color="primary"
                hide-details
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
