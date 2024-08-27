<script setup>
import { useCustomizerStore } from '@/stores/customizer'

const customizer = useCustomizerStore()

</script>
<template>
  <div style="display: flex; align-items: center;margin-left: 8px;">
    <img alt="logo" src="@/assets/logo.png" width="32px">
    <h2 v-if="!customizer.horizontalLayout" class="logo-text" style="margin-left: 8px; margin-top: 20px">Curio</h2>
  </div>
</template>
