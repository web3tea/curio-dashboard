<script setup lang="ts">
import { PropType, onMounted, ref,computed } from 'vue'
import { IconPointFilled } from '@tabler/icons-vue'
import { menuItem } from './sidebarItems'

const props = defineProps({
  item: {
    type: Object as PropType<menuItem>,
    required: true
  },
  level: {
    type: Number,
    default: 0
  },
  mode: {
    type: String,
    default: 'vertical'
  }
})

const relativeURL = ref('')

onMounted(async () => {
  try {
    relativeURL.value = import.meta.env.BASE_URL
  } catch (error) {
    console.error('Error url not found:', error)
  }
})

const icon = computed(() => {
  if (props.item.icon) {
    return props.item.icon
  }else {
    if (props.mode === 'horizontal' && props.level > 1) {
      return IconPointFilled
    }
  }
  return undefined
})
</script>

<template>
  <!-- Horizontal Mode -->
  <template v-if="mode === 'horizontal'">
    <router-link
      class="navItemLink rounded-0"
      :disabled="item.disabled"
      :to="item.to ? item.to : ''"
    >
      <i class="navIcon">
        <component
          :is="icon"
          :level="level"
          size="20"
        />
      </i>
      <span>{{ $t("nav."+item.title) }}</span>
      <small
        v-if="item.subCaption"
        class="text-caption mt-n1 hide-menu"
      >
        {{ item.subCaption }}
      </small>
      <template v-if="item.chip">
        <v-chip
          class="sidebarchip hide-menu ml-auto"
          :color="item.chipColor"
          :prepend-icon="item.chipIcon"
          :size="item.chipIcon ? 'small' : 'small'"
          :variant="item.chipVariant"
        >
          {{ item.chip }}
        </v-chip>
      </template>
    </router-link>
  </template>

  <!-- Vertical Mode -->
  <template v-else>
    <v-list-item
      class="mb-1"
      color="primary"
      :disabled="item.disabled"
      :href="item.type === 'external' && typeof item.to === 'string' ? item.to : ''"
      rounded
      :target="item.type === 'external' ? '_blank' : ''"
      :to="item.type === 'external' ? '' : item.to"
    >
      <template #prepend>
        <component
          :is="icon"
          class="iconClass"
          :level="level"
        />
      </template>
      <v-list-item-title class="mr-auto">
        {{ $t("nav."+item.title) }}
      </v-list-item-title>
      <v-list-item-subtitle
        v-if="item.subCaption"
        class="text-caption mt-n1 hide-menu"
      >
        {{ item.subCaption }}
      </v-list-item-subtitle>
      <template
        v-if="item.chip"
        #append
      >
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
</template>
