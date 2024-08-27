<script setup lang="ts">
import { ref } from 'vue'
// icons
import { ArrowsMaximizeIcon, ArrowsMinimizeIcon } from 'vue-tabler-icons'

const fullscreen = ref(false)

function toggleFullscreen () {
  fullscreen.value = !fullscreen.value
  if (document && !document.fullscreenElement) {
    document.documentElement.requestFullscreen()
  } else if (document.exitFullscreen) {
    document.exitFullscreen()
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
      @click="toggleFullscreen"
    >
      <ArrowsMaximizeIcon v-if="!fullscreen" />
      <ArrowsMinimizeIcon v-if="fullscreen" />
    </v-btn>
  </div>
</template>
