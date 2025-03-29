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
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      },
      long: {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      },
      toDay: {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit',
      },
      toShortDay: {
        month: '2-digit',
        day: '2-digit',
      },
    },
    zh: {
      short: {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      },
      long: {
        year: '2-digit',
        month: 'short',
        day: '2-digit',
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      },
      toDay: {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit',
      },
      toShortDay: {
        month: '2-digit',
        day: '2-digit',
      },
    },
  },
}

export const i18n = createI18n<false, typeof options>(options)
