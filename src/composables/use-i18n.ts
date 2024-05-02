import type { ShallowRef } from 'vue'
import { type Language, getLanguage, setLanguage } from './use-local-cache'
import zhCN from '@/locale/zh-CN.json'
import enUS from '@/locale/en-US.json'
import jaJP from '@/locale/ja-JP.json'

interface I18N {
  lang: ShallowRef<Language>
  setLanguage: (language: Language) => void
  $t: (key: string, fallback?: string) => string
}

export const i18NInjectionKey = import.meta.env.PROD
  ? Symbol('i18n') as InjectionKey<I18N>
  : 'i18n'

export function useI18N() {
  const lang = shallowRef<Language>(getLanguage() as Language)

  const messages = <Record<Language, Record<string, string>>>{
    'zh-CN': zhCN,
    'en-US': enUS,
    'ja-JP': jaJP,
  }

  const msg = computed(() => messages[lang.value] ?? messages['zh-CN'])

  const _setLang = (language: Language) => {
    lang.value = language
    setLanguage(language)
  }

  const $t = (key: string, fallback: string = ''): string => {
    return msg.value[key] ?? fallback
  }

  provide(i18NInjectionKey, {
    lang,
    setLanguage: _setLang,
    $t,
  })

  return {
    lang,
    setLanguage: _setLang,
    $t,
  }
}
