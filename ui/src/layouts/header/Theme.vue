<script setup lang="ts">

import { IconMoon, IconSun } from '@tabler/icons-vue'
import { useCustomizerStore } from '@/stores/customizer'

const customizer = useCustomizerStore()

function toggleTheme () {
  if (customizer.dark) {
    customizer.setDark(false)
  } else {
    customizer.setDark(true)
  }
}

</script>

<template>
  <div>
    <v-btn
      class="text-secondary ml-sm-2 ml-1"
      color="darkText"
      icon="true"
      rounded="sm"
      size="small"
      @click="toggleTheme"
    >
      <IconMoon v-if="!customizer.dark" />
      <IconSun v-if="customizer.dark" />
    </v-btn>
  </div>
</template>

<style scoped lang="scss">

</style>
