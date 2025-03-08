/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import 'vuetify/styles'

import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { icons } from '@/plugins/mdi-icon'

import { LightTheme } from '@/theme/LightTheme'
import { DarkTheme } from '@/theme/DarkTheme'
import { VDateInput } from 'vuetify/labs/components'
import { VSnackbarQueue } from 'vuetify/labs/VSnackbarQueue'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  components: {
    ...components,
    VDateInput,
    VSnackbarQueue,
  },
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases: {
      ...aliases,
      ...icons,
    },
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: 'LightTheme',
    themes: {
      LightTheme,
      DarkTheme,
    },
  },
  defaults: {
    VBtn: {},
    VCard: {
      rounded: 'md',
    },
    VTextField: {
      rounded: 'lg',
    },
    VTooltip: {
      // set v-tooltip default location to top
      location: 'top',
    },
  },
})
