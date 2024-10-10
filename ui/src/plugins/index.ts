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
import Vue3EasyDataTable from 'vue3-easy-data-table'
import Antd from 'ant-design-vue'
import { vMaska } from 'maska/vue'

// Types
import type { App } from 'vue'
import { i18n } from '@/plugins/i18n'
import VueApexCharts from 'vue3-apexcharts'
import { apolloClient } from '@/plugins/apollo'
import { DefaultApolloClient } from '@vue/apollo-composable'
import 'vue3-easy-data-table/dist/style.css'

export function registerPlugins (app: App) {
  app
    .use(vuetify)
    .use(router)
    .use(pinia)
    .use(i18n)
    .use(PerfectScrollbarPlugin)
    .use(Antd)
    .use(VueApexCharts)
    .directive('maska', vMaska)
    .component('EasyDataTable', Vue3EasyDataTable)
    .provide(DefaultApolloClient, apolloClient)
}
