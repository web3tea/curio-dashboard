<script setup lang="ts">
import { PropType } from 'vue'
import NavItem from '../NavItem/NavItem.vue'
import { IconChevronRight } from '@tabler/icons-vue'
import { menu } from '@/layouts/vertical-sidebar/sidebarItem'

const props = defineProps({
  item: {
    type: Object as PropType<menu>,
    required: true,
  },
  level: {
    type: Number,
    required: true,
  },
})
</script>

<template>
  <a class="navItemLink rounded-md cursor-pointer">
    <component :is="props.item.icon" class="iconClass" :level="props.level" :style="{ fontSize: '16px' }" />
    <span class="mr-auto">{{ $t("nav."+item.title) }}</span>
    <small v-if="item.subCaption" class="text-caption mt-n1 hide-menu">
      {{ item.subCaption }}
    </small>
    <i class="ddIcon ml-2"><IconChevronRight size="15" /></i>
  </a>
  <ul :class="`ddMenu px-0 ddLevel-${level + 1}`">
    <li v-for="(subitem, i) in item.children" :key="i" class="navItem rounded-0">
      <NavCollapse v-if="subitem.children" :item="subitem" :level="props.level + 1" />
      <NavItem v-else :item="subitem" :level="props.level + 1" />
    </li>
  </ul>
</template>
