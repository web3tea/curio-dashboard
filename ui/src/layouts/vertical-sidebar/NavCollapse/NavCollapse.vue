<script setup lang="ts">
import NavItem from '../NavItem/NavItem.vue'
import { PropType } from 'vue'
import { menu } from '@/layouts/vertical-sidebar/sidebarItem'

defineProps({
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
  <v-list-group no-action>
    <template #activator="{ props }">
      <v-list-item
        v-bind="props"
        class="mb-1"
        color="primary"
        rounded
        :value="item.title"
      >
        <template #prepend>
          <component :is="item.icon" class="iconClass" :level="level" />
        </template>
        <v-list-item-title class="mr-auto">{{ item.title }}</v-list-item-title>
        <v-list-item-subtitle v-if="item.subCaption" class="text-caption mt-n1 hide-menu">
          {{ item.subCaption }}
        </v-list-item-subtitle>
      </v-list-item>
    </template>
    <template v-for="(subitem, i) in item.children" :key="i">
      <NavCollapse v-if="subitem.children" :item="subitem" :level="level + 1" />
      <NavItem v-else :item="subitem" :level="level + 1" />
    </template>
  </v-list-group>
</template>
