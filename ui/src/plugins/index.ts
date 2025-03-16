/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import vuetify from './vuetify'
import pinia from '../stores'
import router from '../router'
import { PerfectScrollbarPlugin } from 'vue3-perfect-scrollbar'
import { vMaska } from 'maska/vue'

// Types
import type { App } from 'vue'
import { i18n } from '@/plugins/i18n'
import VueApexCharts from 'vue3-apexcharts'
import { apolloClient } from '@/plugins/apollo'
import { DefaultApolloClient } from '@vue/apollo-composable'

export function registerPlugins (app: App) {
  app
    .use(vuetify)
    .use(router)
    .use(pinia)
    .use(i18n)
    .use(PerfectScrollbarPlugin)
    .use(VueApexCharts)
    .directive('maska', vMaska)
    .provide(DefaultApolloClient, apolloClient)
}
