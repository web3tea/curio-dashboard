import { createI18n } from 'vue-i18n'
import messages from '@/utils/locales/messages'

export const i18n = createI18n({
  locale: 'en',
  messages,
  silentTranslationWarn: true,
  silentFallbackWarn: true,
})
