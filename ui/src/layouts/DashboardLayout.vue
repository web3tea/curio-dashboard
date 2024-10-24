<script setup lang="ts">
import { RouterView } from 'vue-router'
import LoaderWrapper from '@/layouts/LoaderWrapper.vue'
import VerticalSidebarVue from '@/layouts/vertical-sidebar/VerticalSidebar.vue'
import VerticalHeader from '@/layouts/header/Header.vue'
import HorizontalSidebar from '@/layouts/horizontal-sidebar/HorizontalSidebar.vue'
import FooterPanel from '@/layouts/footer/FooterPanel.vue'
import { useCustomizerStore } from '@/stores/customizer'

const customizer = useCustomizerStore()
</script>

<template>
  <v-locale-provider>
    <v-app
      :class="[
        customizer.miniSidebar ? 'mini-sidebar' : '',
        customizer.horizontalLayout ? 'horizontalLayout' : 'verticalLayout',
      ]"
      :theme="customizer.dark ? 'DarkTheme' : 'LightTheme'"
    >
      <VerticalSidebarVue v-if="!customizer.horizontalLayout" />
      <VerticalHeader />
      <HorizontalSidebar v-if="customizer.horizontalLayout" />

      <v-main class="page-wrapper">
        <v-container fluid>
          <div>
            <LoaderWrapper />
            <RouterView v-slot="{ Component }">
              <KeepAlive>
                <component :is="Component" />
              </KeepAlive>
            </RouterView>
          </div>
        </v-container>
        <v-container class="pt-0" fluid>
          <div>
            <FooterPanel />
          </div>
        </v-container>
      </v-main>
    </v-app>
  </v-locale-provider>
</template>
