<script setup lang="ts">
import { ref } from 'vue'
import DealInfo from './widgets/DealInfo.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
})

const breadcrumbs = ref([
  {
    title: t('nav.Deals'),
    disabled: true,
    to: '#',
  },
  {
    title: t('nav.MK12Deals'),
    disabled: false,
    to: { name: 'MarketMk12Deals' },
  },
  {
    title: props.id,
    disabled: true,
    to: '#',
  },
])
</script>
<template>
  <BaseBreadcrumb :breadcrumbs="breadcrumbs" />
  <v-row>
    <v-col
      cols="12"
    >
      <DealInfo :id="props.id" />
    </v-col>
  </v-row>
</template>
