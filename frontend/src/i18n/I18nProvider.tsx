import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { detectLang, I18nContext, LANG_STORAGE_KEY, LOCALES, MESSAGES, type I18nValue, type Lang } from './context'

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detectLang)

  // keeps <html lang> right for screen readers, spell check and hyphenation
  useEffect(() => {
    document.documentElement.lang = LOCALES[lang]
  }, [lang])

  const value = useMemo<I18nValue>(() => {
    const locale = LOCALES[lang]
    const dateFormat = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', year: 'numeric' })
    const listFormat = new Intl.ListFormat(locale, { type: 'conjunction' })
    return {
      lang,
      locale,
      t: MESSAGES[lang],
      setLang: (next) => {
        setLangState(next)
        try {
          localStorage.setItem(LANG_STORAGE_KEY, next)
        } catch {
          // no storage: the choice lasts until the page reloads
        }
      },
      formatDate: (iso) => dateFormat.format(new Date(iso)),
      formatList: (items) => listFormat.format(items),
    }
  }, [lang])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}
