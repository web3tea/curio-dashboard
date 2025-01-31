<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
})
const { t } = useI18n()
</script>

<template>
  <v-list-subheader
    class="smallCap text-subtitle-2"
    color="lightText"
  >
    {{ t("nav."+props.item.header) }}
  </v-list-subheader>
</template>
