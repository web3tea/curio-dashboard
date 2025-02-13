<script setup lang="ts">
import { ref } from 'vue'

import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue'
import ConfigurationList from '@/views/configurations/ConfigurationList.vue'

const breadcrumbs = ref([
  {
    title: 'Configurations',
    disabled: false,
    to: { name: 'Configurations' }
  }
])
</script>

<template>
  <BaseBreadcrumb :breadcrumbs="breadcrumbs" />
  <ConfigurationList />
</template>
<style lang="scss">
.customer-modal {
  width: calc(100% - 48px);
  min-width: 340px;
  max-width: 880px;
}
</style>
