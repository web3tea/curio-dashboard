<script setup lang="ts">
import { ref,  watch } from 'vue'
import { IconAlertCircle, IconSwitchVertical,IconPlus } from '@tabler/icons-vue'
import { useMutation, useQuery } from '@vue/apollo-composable'
import { UpdateMarketMk12StorageAsk, GetMarketMk12StorageAsks, GetMarketMk12StorageAsk } from '@/gql/market'
import { useUIStore } from '@/stores/ui'
import { MarketMk12StorageAsk } from '@/typed-graph'
import { filToAttoFilPerGiBPerEpoch, attoFilToFilPerTiBPerMonth } from '@/utils/helpers/convertPrice'
import { pieceSizeOptions } from '@/utils/helpers/pieceSize'

const props = defineProps({
  miner: {
    type: String,
    required: true,
  },
  action: {
    type: String,
    default: 'update',
    validator: (value: string) => ['update', 'add'].includes(value)
  },
})

const uiStore = useUIStore()
const dialog = ref(false)
const localMiner = ref(props.miner)

const { result, loading } = useQuery(GetMarketMk12StorageAsk, {
  spId: localMiner.value,
}, () => ({
  fetchPolicy: 'cache-first',
}))

const minSize = ref<number>()
const maxSize = ref<number>()
const expiry = ref(new Date(new Date().setFullYear(new Date().getFullYear() + 1)))
const priceLocal = ref<number>()
const verifiedPriceLocal = ref<number>(0)

const priceUnits = ['FIL/TiB/Month', 'attoFIL/GiB/Epoch']
const priceUnitIndex = ref(0)
const verifiedPriceIndex = ref(0)

watch(() => result.value?.marketMk12StorageAsk, (newVal: MarketMk12StorageAsk) => {
  if (newVal) {
    priceLocal.value = Number(attoFilToFilPerTiBPerMonth(newVal.price))
    verifiedPriceLocal.value = Number(attoFilToFilPerTiBPerMonth(newVal.verifiedPrice))
    minSize.value = newVal.minSize
    maxSize.value = newVal.maxSize
    expiry.value = new Date(newVal.expiry * 1000)
  }
}, { immediate: true })

const { mutate, loading: updateLoading, onDone, onError } = useMutation(UpdateMarketMk12StorageAsk, () => ({
  variables: {
    input: {
      spId: localMiner.value,
      price: priceUnitIndex.value === 0
        ? filToAttoFilPerGiBPerEpoch(priceLocal.value || 0)
        : priceLocal.value,
      verifiedPrice: verifiedPriceIndex.value === 0
        ? filToAttoFilPerGiBPerEpoch(verifiedPriceLocal.value)
        : verifiedPriceLocal.value,
      minSize: minSize.value,
      maxSize: maxSize.value,
      expiry: Math.floor(expiry.value.getTime() / 1000),
    }
  },
  refetchQueries: [{
    query: GetMarketMk12StorageAsks,
  }],
  awaitRefetchQueries: true,
}))

onDone(() => {
  dialog.value = false
  uiStore.appendMsg({
    type: 'success',
    msg: `Ask for ${localMiner.value} successfully ${props.action === 'add' ? 'created' : 'updated'}`,
  })
})

onError(e => {
  uiStore.appendMsg({
    type: 'error',
    msg: e.message,
  })
})

function switchPrice() {
  const converter = priceUnitIndex.value === 0 ? filToAttoFilPerGiBPerEpoch : attoFilToFilPerTiBPerMonth
  priceLocal.value = Number(converter(priceLocal.value || 0))
  priceUnitIndex.value = 1 - priceUnitIndex.value
}

function switchVerifiedPrice() {
  const converter = verifiedPriceIndex.value === 0 ? filToAttoFilPerGiBPerEpoch : attoFilToFilPerTiBPerMonth
  verifiedPriceLocal.value = Number(converter(verifiedPriceLocal.value))
  verifiedPriceIndex.value = 1 - verifiedPriceIndex.value
}

const form = ref()
// const handleSubmit = async () => await form.value.validate() && mutate()
const handleSubmit = async () => {
  const { valid } = await form.value.validate()
  if (!valid) {
    return
  }
  mutate()
}

const rules = {
  required: (v: string) => !!v || 'This field is required',
  price: [
    (v: number) => !!v || 'Price is required',
    (v: number) => v >= 0 || 'Price cannot be negative',
  ],
  pieceSize: [
    (v: number) => !!v || 'Piece size is required',
  ],
  maxSize: [
    (v: number) => !!v || 'Max size is required',
    (v: number) => (minSize.value !== undefined && v >= minSize.value) || 'Max size must be greater than or equal to min size',
  ],
  expiry: [
    (v: Date) => !!v || 'Expiry date is required',
    (v: Date) => new Date(v) > new Date() || 'Expiry date must be in the future',
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
        Update Ask
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
      :title="`Set Ask For ${localMiner}`"
    >
      <v-card-text>
        <v-form
          ref="form"
          @submit.prevent="handleSubmit"
        >
          <v-row>
            <v-col
              v-if="action !== 'update'"
              cols="12"
            >
              <v-label class="text-subtitle-1 text-high-emphasis mb-2">
                Miner
              </v-label>
              <MinerSelectInput
                v-model="localMiner"
                :rules="[rules.required]"
                label=""
              />
            </v-col>

            <v-col cols="12">
              <v-label class="text-subtitle-1 text-high-emphasis mb-2">
                Price
              </v-label>
              <v-text-field
                v-model="priceLocal"
                type="number"
                color="primary"
                :rules="rules.price"
                variant="outlined"
                :suffix="priceUnits[priceUnitIndex]"
                density="comfortable"
                hide-spin-buttons
                :append-inner-icon="IconSwitchVertical"
                @click:append-inner="switchPrice"
              />
            </v-col>

            <v-col cols="12">
              <v-label class="text-subtitle-1 text-high-emphasis mb-2">
                Verified Price
              </v-label>
              <v-text-field
                v-model="verifiedPriceLocal"
                type="number"
                color="primary"
                :rules="rules.price"
                variant="outlined"
                :suffix="priceUnits[verifiedPriceIndex]"
                density="comfortable"
                hide-spin-buttons
                :append-inner-icon="IconSwitchVertical"
                @click:append-inner="switchVerifiedPrice"
              />
            </v-col>

            <v-col cols="12">
              <v-label class="text-subtitle-1 text-high-emphasis mb-2">
                Min Piece Size
              </v-label>
              <v-autocomplete
                v-model="minSize"
                color="primary"
                variant="outlined"
                density="comfortable"
                :items="pieceSizeOptions"
                :rules="rules.pieceSize"
                auto-select-first
                required
              />
            </v-col>

            <v-col cols="12">
              <v-label class="text-subtitle-1 text-high-emphasis mb-2">
                Max Piece Size
              </v-label>
              <v-autocomplete
                v-model="maxSize"
                color="primary"
                variant="outlined"
                density="comfortable"
                :items="pieceSizeOptions"
                :rules="rules.maxSize"
                required
                :auto-select-first="true"
              />
            </v-col>

            <v-col cols="12">
              <v-label class="text-subtitle-1 text-high-emphasis mb-2">
                Expire At
              </v-label>
              <v-date-input
                v-model="expiry"
                color="primary"
                variant="outlined"
                density="comfortable"
                :rules="rules.expiry"
                prepend-icon=""
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
                :loading="updateLoading"
                color="primary"
                variant="elevated"
              >
                Save
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
