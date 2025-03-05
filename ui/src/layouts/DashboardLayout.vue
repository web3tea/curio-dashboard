<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import LoaderWrapper from '@/layouts/LoaderWrapper.vue'
import VerticalHeader from '@/layouts/header/AppHeader.vue'
import FooterPanel from '@/layouts/footer/FooterPanel.vue'
import { useCustomizerStore } from '@/stores/customizer'
import { useNotificationStore } from '@/stores/notification'
import { storeToRefs } from 'pinia'
import DashboardSidebar from './sidebar/DashboardSidebar.vue'

const notificationStore =  useNotificationStore()
const customizer = useCustomizerStore()
const route = useRoute()
const { queue } = storeToRefs(notificationStore)

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
      <v-snackbar-queue
        v-model="queue"
        location="top"
      />
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
