import { createI18n, type I18nOptions } from 'vue-i18n'
import messages from '@/utils/locales/messages'

const options: I18nOptions = {
  legacy: false,
  locale: 'en',
  messages,
  silentTranslationWarn: true,
  silentFallbackWarn: true,
  fallbackLocale: 'en',
  formatFallbackMessages: true,
  datetimeFormats: {
    en: {
      short: {
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false,
      },
      long: {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
      },
      toDay: {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      },
      toShortDay: {
        month: 'numeric',
        day: 'numeric',
      },
    },
    zh: {
      short: {
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false,
      },
      long: {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        weekday: 'short',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      },
      toDay: {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      },
      toShortDay: {
        month: 'numeric',
        day: 'numeric',
      },
    },
  },
}

export const i18n = createI18n<false, typeof options>(options)
