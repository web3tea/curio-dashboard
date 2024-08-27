<script setup>
import NavItem from '../NavItem/NavItem.vue'

const props = defineProps({ item: Object, level: Number })
</script>

<template>
  <!-- ---------------------------------------------- -->
  <!---Item Childern -->
  <!-- ---------------------------------------------- -->
  <v-list-group no-action>
    <!-- ---------------------------------------------- -->
    <!---Dropdown  -->
    <!-- ---------------------------------------------- -->
    <template #activator="{ props1 }">
      <v-list-item
        v-bind="props1"
        class="mb-1"
        color="primary"
        rounded
        :value="item.title"
      >
        <!---Icon  -->
        <template #prepend>
          <component :is="item.icon" class="iconClass" :level="level" />
        </template>
        <!---Title  -->
        <v-list-item-title class="mr-auto">{{ item.title }}</v-list-item-title>
        <!---If Caption-->
        <v-list-item-subtitle v-if="item.subCaption" class="text-caption mt-n1 hide-menu">
          {{ item.subCaption }}
        </v-list-item-subtitle>
      </v-list-item>
    </template>
    <!-- ---------------------------------------------- -->
    <!---Sub Item-->
    <!-- ---------------------------------------------- -->
    <template v-for="(subitem, i) in item.children" :key="i">
      <NavCollapse v-if="subitem.children" :item="subitem" :level="props.level + 1" />
      <NavItem v-else :item="subitem" :level="props.level + 1" />
    </template>
  </v-list-group>

  <!-- ---------------------------------------------- -->
  <!---End Item Sub Header -->
  <!-- ---------------------------------------------- -->
</template>
