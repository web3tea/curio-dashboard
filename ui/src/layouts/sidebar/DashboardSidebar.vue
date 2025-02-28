<script setup lang="ts">
import {  computed } from 'vue'
import { useDisplay } from 'vuetify'
import NavItem from './NavItem.vue'
import { useSidebarItems } from './sidebarItems'
import NavCollapse from './NavCollapse.vue'
import NavGroup from './NavGroup.vue'
import Logo from '@/layouts/logo/AppLogo.vue'
import { useCustomizerStore } from '@/stores/customizer'
import { menuItem } from './sidebarItems'

const props = defineProps({
  mode: {
    type: String,
    default: 'vertical', // 'vertical' | 'horizontal'
  }
})

const customizer = useCustomizerStore()
const { mdAndUp } = useDisplay()
const sidebarItemsRef = useSidebarItems()

const horizontalMenu = computed(() => {
  const menu: menuItem[] = []
  let currentGroup: menuItem | null = null

  sidebarItemsRef.value.forEach(item => {
    if (item.header) {
      currentGroup = {
        title: item.header,
        icon: item.icon,
        children: []
      }
      menu.push(currentGroup)
    } else if (currentGroup && !item.divider) {
      if (item.children && currentGroup.children) {
        currentGroup.children.push(item)
      } else if (currentGroup.children) {
        currentGroup.children.push(item)
      }
    }
  })

  return menu
})

const menuItems = computed(() => {
  return props.mode === 'horizontal' ? horizontalMenu.value : sidebarItemsRef.value
})
</script>

<template>
  <!-- Horizontal Mode -->
  <template v-if="mode === 'horizontal' && mdAndUp">
    <div class="horizontalMenu">
      <v-container
        fluid
        class="py-0"
      >
        <ul class="gap-1 horizontal-navbar px-0">
          <li
            v-for="(item, i) in menuItems"
            :key="i"
            class="navItem"
          >
            <NavCollapse
              v-if="item.children"
              :item="item"
              :level="0"
              :mode="mode"
            />
            <NavItem
              v-else
              :item="item"
              :mode="mode"
            />
          </li>
        </ul>
      </v-container>
    </div>
  </template>

  <!-- Vertical Mode -->
  <template v-else>
    <v-navigation-drawer
      v-model="customizer.sidebarDrawer"
      class="leftSidebar"
      elevation="0"
      expand-on-hover
      left
      mobile-breakpoint="lg"
      :rail="customizer.miniSidebar"
      rail-width="60"
    >
      <div class="pa-5">
        <Logo />
      </div>

      <perfect-scrollbar class="scrollnavbar">
        <v-list>
          <template
            v-for="(item, i) in menuItems"
            :key="i"
          >
            <NavGroup
              v-if="item.header"
              :item="item"
            />
            <v-divider
              v-else-if="item.divider"
              class="my-3"
            />
            <NavCollapse
              v-else-if="item.children"
              :item="item"
              :level="0"
              :mode="mode"
            />
            <NavItem
              v-else
              :item="item"
              :mode="mode"
            />
          </template>
        </v-list>
      </perfect-scrollbar>
    </v-navigation-drawer>
  </template>
</template>
