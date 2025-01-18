<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import LoaderWrapper from '@/layouts/LoaderWrapper.vue'
import VerticalHeader from '@/layouts/header/AppHeader.vue'
import FooterPanel from '@/layouts/footer/FooterPanel.vue'
import { useCustomizerStore } from '@/stores/customizer'
import { useUIStore } from '@/stores/ui'
import { storeToRefs } from 'pinia'
import { IconX } from '@tabler/icons-vue'
import DashboardSidebar from './sidebar/DashboardSidebar.vue'

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
      <DashboardSidebar :mode="customizer.horizontalLayout ? 'horizontal' : 'vertical'" />
      <v-snackbar
        v-model="showSnackbar"
        :color="snackbarMsg?.type"
        location="top"
        rounded="md"
      >
        <v-icon
          class="mr-1"
          icon="$checkboxMarkedCircleOutline"
        />
        {{ snackbarMsg?.msg }}
        <template #actions>
          <v-btn
            color="white"
            :icon="IconX"
            variant="text"
            @click="showSnackbar = false"
          />
        </template>
      </v-snackbar>
      <v-main class="page-wrapper">
        <v-container fluid>
          <div>
            <LoaderWrapper />
            <RouterView v-slot="{ Component }">
              <KeepAlive>
                <component
                  :is="Component"
                  :key="route.fullPath"
                />
              </KeepAlive>
            </RouterView>
          </div>
        </v-container>
        <v-container
          class="pt-0"
          fluid
        >
          <div>
            <FooterPanel />
          </div>
        </v-container>
      </v-main>
    </v-app>
  </v-locale-provider>
</template>
