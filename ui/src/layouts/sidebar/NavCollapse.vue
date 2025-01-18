<script setup lang="ts">
import { PropType } from 'vue'
import NavItem from './NavItem.vue'
import { IconChevronRight } from '@tabler/icons-vue'
import { menuItem } from './sidebarItems'

defineProps({
  item: {
    type: Object as PropType<menuItem>,
    required: true,
  },
  level: {
    type: Number,
    required: true,
  },
  mode: {
    type: String,
    default: 'vertical'
  }
})
</script>

<template>
  <!-- Horizontal Mode -->
  <template v-if="mode === 'horizontal'">
    <a class="navItemLink rounded-md cursor-pointer">
      <component
        :is="item.icon"
        v-if="item.icon"
        class="nav-icon mr-2"
        size="20"
      />
      <span class="nav-text">{{ $t("nav."+item.title) }}</span>
      <i class="ddIcon ml-2"><IconChevronRight size="15" /></i>
    </a>
    <ul :class="`ddMenu ddLevel-${level + 1}`">
      <li
        v-for="(subitem, i) in item.children"
        :key="i"
        class="navItem"
      >
        <NavCollapse
          v-if="subitem.children"
          :item="subitem"
          :level="level + 1"
          :mode="mode"
        />
        <NavItem
          v-else
          :item="subitem"
          :level="level + 1"
          :mode="mode"
        />
      </li>
    </ul>
  </template>

  <!-- Vertical Mode -->
  <template v-else>
    <v-list-group>
      <template #activator="{ props }">
        <v-list-item
          v-bind="props"
          class="mb-1"
          color="primary"
          rounded
          :value="item.title"
        >
          <template #prepend>
            <component
              :is="item.icon"
              class="iconClass"
              :level="level"
            />
          </template>
          <v-list-item-title class="mr-auto">
            {{ $t("nav."+item.title) }}
          </v-list-item-title>
        </v-list-item>
      </template>
      <template
        v-for="(subitem, i) in item.children"
        :key="i"
      >
        <NavCollapse
          v-if="subitem.children"
          :item="subitem"
          :level="level + 1"
          :mode="mode"
        />
        <NavItem
          v-else
          :item="subitem"
          :level="level + 1"
          :mode="mode"
        />
      </template>
    </v-list-group>
  </template>
</template>
