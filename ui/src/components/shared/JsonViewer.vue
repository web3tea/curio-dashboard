<script setup lang="ts">
import { computed } from 'vue'
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'

import { useCustomizerStore } from "@/stores/customizer"
const customizer = useCustomizerStore()

const props = defineProps({
  data: {
    type: Object,
    default: undefined
  },
  title: {
    type: String,
    default: 'JSON Data'
  }
})

const displayData = computed(() => props.data === undefined ? {} : props.data)
const stringifiedData = computed(() => JSON.stringify(displayData.value, null, 2))

</script>
<template>
  <v-card>
    <v-card-item>
      <div class="d-flex justify-space-between align-center">
        <v-card-title class="text-h6">
          {{ title }}
        </v-card-title>
        <CopyIcon :value="stringifiedData" />
      </div>
    </v-card-item>
    <v-card-text>
      <div
        v-if="data === undefined"
        class="text-center text-grey pa-4"
      >
        No data available
      </div>
      <VueJsonPretty
        v-else
        :data="data"
        :theme="customizer.dark ? 'dark' : 'light'"
        :show-double-quotes="false"
        selectable-type="multiple"
      />
    </v-card-text>
  </v-card>
</template>
