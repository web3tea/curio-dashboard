<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    default: 'Title',
  },
  className: {
    type: String,
    default: 'rounded-md overflow-hidden',
  },
  loading: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <v-card
    class="title-card"
    :loading="loading"
    variant="text"
  >
    <v-card-item class="pb-2 px-0 pt-0">
      <template #title>
        {{ props.title }}
      </template>
      <template #subtitle>
        <slot name="subtitle" />
      </template>
      <template #append>
        <slot name="append" />
      </template>
    </v-card-item>
    <v-card-text :class="props.className">
      <slot />
    </v-card-text>
  </v-card>
</template>

<style scoped lang="scss">

</style>
