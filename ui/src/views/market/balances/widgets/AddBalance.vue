<script setup lang="ts">
import { useMutation } from '@vue/apollo-composable'
import { ref, computed } from 'vue'
import { AddMarketBalance } from '@/gql/market'
import { IconAlertCircle } from '@tabler/icons-vue'
import { useUIStore } from '@/stores/ui'

const props = defineProps({
  miner: {
    type: String,
    default: '',
  },
})

const uiStore = useUIStore()
const dialog = ref(false)
const localMiner = ref<string>(props.miner)
const minerInit = computed(() => props.miner ? true : false)
const amount = ref<string>()
const wallet = ref<string>()

const { mutate, loading, onDone, onError } = useMutation(AddMarketBalance, () => ({
  variables: {
    miner: localMiner.value,
    amount: amount.value,
    wallet: wallet.value,
  },
}))

onDone(() => {
  dialog.value = false
  uiStore.appendMsg({
    type: 'success',
    msg: 'Balance added successfully',
  })
})

onError(e => {
  uiStore.appendMsg({
    type: 'error',
    msg: e.message,
  })
})

const form = ref()
const handleSubmit = async () => {
  const { valid } = await form.value.validate()
  if (!valid) {
    return
  }
  mutate()
}

const rules = {
  required: (v: string) => !!v || 'This field is required',
  amount: [
    (v: string) => !isNaN(Number(v)) || 'This field must be a number',
    (v: string) => Number(v) > 0 || 'This field must be a positive number',
  ],
  address: [
    (v: string) => !!v || 'Address is required',
    (v: string) => /^[tf][1-4][a-z0-9]{3,40}$/i.test(v) || 'Invalid address format',
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
        color="primary"
        variant="elevated"
        v-bind="activatorProps"
      >
        Add Balance
      </v-btn>
    </template>

    <v-card
      :loading="loading"
      :prepend-icon="IconAlertCircle"
      title="Move Funds To Escrow"
    >
      <v-card-text>
        <v-form
          ref="form"
          @submit.prevent="handleSubmit"
        >
          <v-row>
            <v-col
              cols="12"
            >
              <v-label class="text-subtitle-1 text-high-emphasis mb-2">
                Miner
              </v-label>
              <MinerSelectInput
                v-model="localMiner"
                :rules="[rules.required]"
                label=""
                :disabled="minerInit"
              />
            </v-col>

            <v-col cols="12">
              <v-label class="text-subtitle-1 text-high-emphasis mb-2">
                Amount
              </v-label>
              <v-text-field
                v-model="amount"
                color="primary"
                :rules="rules.amount"
                variant="outlined"
                suffix="FIL"
                density="comfortable"
              />
            </v-col>

            <v-col cols="12">
              <v-label class="text-subtitle-1 text-high-emphasis mb-2">
                From Wallet
              </v-label>
              <v-text-field
                v-model="wallet"
                color="primary"
                :rules="rules.address"
                variant="outlined"
                density="comfortable"
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
                Send
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
