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
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      },
      long: {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        weekday: 'short',
        hour: 'numeric',
        minute: 'numeric',
      },
    },
    zh: {
      short: {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
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
