<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import LoaderWrapper from '@/layouts/LoaderWrapper.vue'
import VerticalSidebarVue from '@/layouts/vertical-sidebar/VerticalSidebar.vue'
import VerticalHeader from '@/layouts/header/Header.vue'
import HorizontalSidebar from '@/layouts/horizontal-sidebar/HorizontalSidebar.vue'
import FooterPanel from '@/layouts/footer/FooterPanel.vue'
import { useCustomizerStore } from '@/stores/customizer'
import { useUIStore } from '@/stores/ui'
import { storeToRefs } from 'pinia'
import { IconX } from '@tabler/icons-vue'

const uiStore = useUIStore()
const customizer = useCustomizerStore()
const route = useRoute()
const { showSnackbar, snackbarMsg } = storeToRefs(uiStore)

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
      <VerticalHeader />
      <HorizontalSidebar v-if="customizer.horizontalLayout" />
      <VerticalSidebarVue v-else />

      <v-snackbar
        v-model="showSnackbar"
        :color="snackbarMsg?.type"
        location="top"
        rounded="md"
      >
        <v-icon class="mr-1" icon="$checkboxMarkedCircleOutline" />
        {{ snackbarMsg?.msg }}
        <template #actions>
          <v-btn color="white" variant="text" @click="showSnackbar = false">
            <IconX />
          </v-btn>
        </template>
      </v-snackbar>
      <v-main class="page-wrapper">
        <v-container fluid>
          <div>
            <LoaderWrapper />
            <RouterView v-slot="{ Component }">
              <KeepAlive>
                <component :is="Component" :key="route.fullPath" />
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
