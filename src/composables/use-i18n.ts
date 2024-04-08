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

export const i18NInjectionKey = Symbol('i18n') as InjectionKey<I18N>

function loadLanguage(lang: Language) {
  return import.meta.glob(`@/locale/*.json`)[`/src/locale/${lang}.json`]()
}

export function useI18N() {
  const lang = shallowRef<Language>(getLanguage() as Language)

  const messages = ref<Record<Language, null | Record<string, string>>>({
    'zh-CN': zhCN,
    'en-US': enUS,
    'ja-JP': jaJP,
  })

  const msg = computed(() => messages.value[lang.value] ?? messages.value['zh-CN'])

  const _setLang = (language: Language) => {
    lang.value = language
    setLanguage(language)

    if (!messages.value[language]) {
      loadLanguage(language).then((res: any) => {
        messages.value[language] = res.default as Record<string, string>
      })
    }
  }

  const $t = (key: string, fallback: string = ''): string => {
    return msg.value?.[key] ?? fallback
  }

  _setLang(lang.value)

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
