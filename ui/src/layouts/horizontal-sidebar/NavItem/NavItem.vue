<script setup lang="ts">
import { menu } from '@/layouts/horizontal-sidebar/horizontalItems'
import { PropType } from 'vue'

const props = defineProps({
  item: {
    type: Object as PropType<menu>,
    required: true,
  },
  level: {
    type: Number,
    required: false,
    default: 0,
  },
})
</script>

<template>
  <!---Single Item-->
  <router-link
    class="navItemLink rounded-0"
    :disabled="item.disabled"
    :to="`${item.to}`"
  >
    <!---If icon-->
    <component
      :is="props.item.icon"
      :level="props.level"
      :style="{ fontSize: '16px' }"
    />
    <span>{{ $t("nav."+item.title) }}</span>
    <!---If Caption-->
    <small
      v-if="item.subCaption"
      class="text-caption mt-n1 hide-menu"
    >
      {{ item.subCaption }}
    </small>
    <!---If any chip or label-->
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
