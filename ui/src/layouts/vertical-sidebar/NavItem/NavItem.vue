<script setup>
import { onMounted, ref } from 'vue'
import { string } from 'yup'
const props = defineProps({ item: Object, level: Number })

const relativeURL = ref(string)

onMounted(async () => {
  try {
    relativeURL.value = await import.meta.env.BASE_URL
  } catch (error) {
    console.error('Error url not found:', error)
  }
})
</script>

<template>
  <!---Single Item-->
  <v-list-item
    v-if="props.item.getURL === true"
    class="mb-1"
    color="primary"
    :disabled="item.disabled"
    :href="`${relativeURL}${item.to}`"
    rounded
    :target="item.type === 'external' ? '_blank' : ''"
    :to="item.type === 'external' ? '' : item.to"
  >
    <!---If icon-->
    <template #prepend>
      <component :is="props.item.icon" class="iconClass" :level="props.level" />
    </template>
    <v-list-item-title>{{ $t(item.title) }}</v-list-item-title>
    <!---If Caption-->
    <v-list-item-subtitle v-if="item.subCaption" class="text-caption mt-n1 hide-menu">
      {{ item.subCaption }}
    </v-list-item-subtitle>
    <!---If any chip or label-->
    <template v-if="item.chip" #append>
      <v-chip
        class="sidebarchip hide-menu"
        :color="item.chipColor"
        label
        :prepend-icon="item.chipIcon"
        size="small"
        :variant="item.chipVariant"
      >
        {{ item.chip }}
      </v-chip>
    </template>
  </v-list-item>
  <v-list-item
    v-else
    class="mb-1"
    color="primary"
    :disabled="item.disabled"
    :href="item.type === 'external' ? item.to : ''"
    rounded
    :target="item.type === 'external' ? '_blank' : ''"
    :to="item.type === 'external' ? '' : item.to"
  >
    <!---If icon-->
    <template #prepend>
      <component :is="props.item.icon" class="iconClass" :level="props.level" />
    </template>
    <v-list-item-title>{{ $t(item.title) }}</v-list-item-title>
    <!---If Caption-->
    <v-list-item-subtitle v-if="item.subCaption" class="text-caption mt-n1 hide-menu">
      {{ item.subCaption }}
    </v-list-item-subtitle>
    <!---If any chip or label-->
    <template v-if="item.chip" #append>
      <v-chip
        class="sidebarchip hide-menu"
        :color="item.chipColor"
        label
        :prepend-icon="item.chipIcon"
        size="small"
        :variant="item.chipVariant"
      >
        {{ item.chip }}
      </v-chip>
    </template>
  </v-list-item>
</template>
