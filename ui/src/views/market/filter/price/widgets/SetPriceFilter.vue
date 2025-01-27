<script setup lang="ts">
import { useMutation } from '@vue/apollo-composable'
import { ref } from 'vue'
import { AddMarketPriceFilter } from '@/gql/market'
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
// const minDurationDays = ref<number>()
// const maxDurationDays = ref<number>()
// const minimumSize = ref<number>()
// const maximumSize = ref<number>()
// const price = ref<number>()
// const verified = ref<boolean>()

const { mutate, loading, onDone, onError } = useMutation(AddMarketPriceFilter, () => ({
  variables: {
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
      :title="props.action === 'add' ? 'Add Pricing Filter': 'Update Pricing Filter'"
    >
      <v-card-text>
        <v-form
          ref="form"
          @submit.prevent="handleSubmit"
        >
          <v-row>
            <v-col cols="12">
              <v-label class="text-subtitle-1 text-high-emphasis mb-2">
                Name
              </v-label>
              <v-text-field
                v-model="name"
                color="primary"
                :rules="[rules.required]"
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
