<script setup>
import { useCustomizerStore } from '@/stores/customizer'
import { computed } from 'vue'
const customizer = useCustomizerStore()

const marginBottom = computed(() => {
  return customizer.logoMarginBottom ? '10px' : '0'
})

</script>
<template>
  <div class="logo-container">
    <img
      alt="logo"
      src="@/assets/logo.png"
      width="32"
    >
    <h4
      style="margin-left: 8px; line-height: 1.2"
    >
      Curio<br>Dashboard
    </h4>
  </div>
</template>

<style scoped>
.logo-container {
  display: flex;
  align-items: center;
  margin-left: 8px;
  margin-bottom: v-bind(marginBottom);
}
</style>
