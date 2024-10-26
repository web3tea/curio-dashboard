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
    },
  },
}

export const i18n = createI18n<false, typeof options>(options)
