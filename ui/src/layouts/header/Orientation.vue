<script setup lang="ts">

import { IconGripHorizontal, IconGripVertical } from '@tabler/icons-vue'
import { useCustomizerStore } from '@/stores/customizer'

const customizer = useCustomizerStore()

function toggleOrientation () {
  if (customizer.horizontalLayout) {
    customizer.setHorizontalLayout(false)
  } else {
    customizer.setHorizontalLayout(true)
  }
}

</script>

<template>
  <div>
    <v-btn
      class="text-secondary ml-sm-2 ml-1"
      color="darkText"
      :icon="customizer.horizontalLayout? IconGripVertical:IconGripHorizontal"
      rounded="sm"
      size="small"
      @click="toggleOrientation"
    />
  </div>
</template>

<style scoped lang="scss">

</style>
