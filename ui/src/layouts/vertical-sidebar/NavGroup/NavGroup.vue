<script setup lang="ts">
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <v-list-subheader
    class="smallCap text-subtitle-2"
    color="lightText"
  >
    {{ $t("nav."+props.item.header) }}
  </v-list-subheader>
</template>
