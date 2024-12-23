<script setup>
import { useCustomizerStore } from '@/stores/customizer'

const customizer = useCustomizerStore()

</script>
<template>
  <div style="display: flex; align-items: center;margin-left: 8px;">
    <img alt="logo" src="@/assets/logo.png" width="32">
    <h4 v-if="!customizer.horizontalLayout" style="margin-left: 8px; margin-top: 14px; line-height: 1.2">
  Curio<br>Dashboard
</h4>
  </div>
</template>
