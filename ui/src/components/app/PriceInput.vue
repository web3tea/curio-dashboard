<script setup lang="ts">
import { ref, computed } from 'vue'
import { IconSwitchVertical } from '@tabler/icons-vue'
import { filToAttoFilPerGiBPerEpoch, attoFilToFilPerTiBPerMonth } from '@/utils/helpers/convertPrice'

const props = defineProps({
  label: {
    type: String,
    default: 'Price',
  },
})

const price = defineModel({
  type: Number,
  default: 0,
})

const rules = [
  (v: number) => !!v || `${props.label} is required`,
  (v: number) => v >= 0 || `${props.label} cannot be negative`,
]
const priceUnits = ['FIL/TiB/Month', 'attoFIL/GiB/Epoch']
const priceUnitIndex = ref(0)
const priceLocalCache = ref(attoFilToFilPerTiBPerMonth(price.value))
const priceLocal = computed({
  get: () => {
    return priceLocalCache.value
  },
  set: (v: string) => {
    priceLocalCache.value = v
    price.value = priceUnitIndex.value === 0 ? filToAttoFilPerGiBPerEpoch(Number(v)) : Number(v)
  },
})

function switchPrice() {
  const converter = priceUnitIndex.value === 0 ? filToAttoFilPerGiBPerEpoch : attoFilToFilPerTiBPerMonth
  priceLocal.value = converter(Number(priceLocal.value) || 0).toString()
  priceUnitIndex.value = 1 - priceUnitIndex.value
}
</script>
<template>
  <v-text-field
    v-model="priceLocal"
    type="number"
    color="primary"
    :rules="rules"
    variant="outlined"
    :suffix="priceUnits[priceUnitIndex]"
    density="comfortable"
    hide-spin-buttons
    :append-inner-icon="IconSwitchVertical"
    @click:append-inner="switchPrice"
  />
</template>
