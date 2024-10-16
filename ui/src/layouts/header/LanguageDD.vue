<script setup lang="ts">
import { shallowRef } from 'vue'

const languageDD = shallowRef([
  { title: 'English', subtext: '英文', value: 'en' },
  { title: '中文', subtext: 'Chinese', value: 'zh' },
])
</script>

<template>
  <v-list aria-busy="true" aria-label="language list" class="py-0">
    <v-list-item
      v-for="(item, index) in languageDD"
      :key="index"
      :active="$i18n.locale == item.value"
      class="d-flex align-center"
      color="primary"
      @click="() => ($i18n.locale = item.value)"
    >
      <v-list-item-title class="text-subtitle-1 font-weight-regular">
        {{ item.title }}
        <span class="text-lightText text-caption pl-2">({{ item.subtext }})</span>
      </v-list-item-title>
    </v-list-item>
  </v-list>
</template>
