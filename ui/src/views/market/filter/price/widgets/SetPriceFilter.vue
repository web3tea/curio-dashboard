<script setup lang="ts">
import { useMutation,useQuery } from '@vue/apollo-composable'
import { ref, computed } from 'vue'
import { AddMarketPriceFilter, GetMarketPriceFilters, CheckMarketPriceFilter } from '@/gql/market'
import { IconAlertCircle,IconPlus } from '@tabler/icons-vue'
import { useUIStore } from '@/stores/ui'

const props = defineProps({
  action: {
    type: String,
    default: 'add',
    validator: (value: string) => ['update', 'add'].includes(value)
  },
})

const uiStore = useUIStore()
const dialog = ref(false)

const name = ref<string>()
const minDurationDays = ref(180)
const maxDurationDays = ref(1278)
const minimumSize = ref(256)
const maximumSize = ref(34359738368)
const price = ref(0)
const verified = ref(false)

const { mutate, loading, onDone, onError } = useMutation(AddMarketPriceFilter, () => ({
  variables: {
    input: {
      name: name.value,
      minDurationDays: minDurationDays.value,
      maxDurationDays: maxDurationDays.value,
      minimumSize: minimumSize.value,
      maximumSize: maximumSize.value,
      price: price.value,
      verified: verified.value,
    }
  },
  refetchQueries: [{
    query: GetMarketPriceFilters,
  }],
  awaitRefetchQueries: true,
}))

onDone(() => {
  dialog.value = false
  uiStore.appendMsg({
    type: 'success',
    msg: props.action === 'add' ? 'Price filter added successfully' : 'Price filter updated successfully',
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

const { result: checkResult, loading: checkLoading } = useQuery(CheckMarketPriceFilter, {
  name: name
})

const exists = computed(() => {
  return !checkLoading.value && !!checkResult.value?.marketCheckPriceFilter
})

const rules = {
  name: [
    (v: string) => !!v || 'Name is required',
    () => {
      if (props.action === 'add') {
        return !exists.value || 'Price filter with this name already exists'
      }
      return true
    }
  ],
  duration: [
    (v: string) => !isNaN(Number(v)) || 'This field must be a number',
    (v: string) => Number(v) >= 180 || 'Duration must be at least 180 days',
    (v: string) => Number(v) <= 1278 || 'Duration must not exceed 1278 days',
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
      :title="props.action === 'add' ? 'Add Pricing Filter': 'Update Pricing Filter'"
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
              />
            </v-col>
            <v-col cols="6">
              <v-label class="text-subtitle-1 text-high-emphasis mb-2">
                Verified Deal
              </v-label>
              <v-checkbox
                v-model="verified"
                color="primary"
                hide-details
              />
            </v-col>
            <v-col cols="12">
              <v-label class="text-subtitle-1 text-high-emphasis mb-2">
                Min Duration
              </v-label>
              <v-text-field
                v-model="minDurationDays"
                color="primary"
                :rules="rules.duration"
                variant="outlined"
                density="comfortable"
                suffix="Days"
              />
            </v-col>
            <v-col cols="12">
              <v-label class="text-subtitle-1 text-high-emphasis mb-2">
                Max Duration
              </v-label>
              <v-text-field
                v-model="maxDurationDays"
                color="primary"
                :rules="rules.duration"
                variant="outlined"
                density="comfortable"
                suffix="Days"
              />
            </v-col>
            <v-col cols="12">
              <v-label class="text-subtitle-1 text-high-emphasis mb-2">
                Min Size
              </v-label>
              <v-text-field
                v-model="minimumSize"
                color="primary"
                :rules="rules.size"
                variant="outlined"
                density="comfortable"
                suffix="Bytes"
              />
            </v-col>
            <v-col cols="12">
              <v-label class="text-subtitle-1 text-high-emphasis mb-2">
                Max Size
              </v-label>
              <v-text-field
                v-model="maximumSize"
                color="primary"
                :rules="rules.size"
                variant="outlined"
                density="comfortable"
                suffix="Bytes"
              />
            </v-col>
            <v-col cols="12">
              <v-label class="text-subtitle-1 text-high-emphasis mb-2">
                Price
              </v-label>
              <PriceInput v-model="price" />
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
