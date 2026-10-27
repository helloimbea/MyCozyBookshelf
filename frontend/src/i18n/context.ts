import { createContext, useContext } from 'react'
import { AppError } from '../services/errors'
import { en, type Messages } from './messages.en'
import { es } from './messages.es'
import { pt } from './messages.pt'

export type Lang = 'en' | 'pt' | 'es'

export const LANGS: Lang[] = ['en', 'es', 'pt']
export const MESSAGES: Record<Lang, Messages> = { en, es, pt }

/** BCP 47 tag used for dates, sorting and <html lang>. */
export const LOCALES: Record<Lang, string> = { en: 'en', es: 'es', pt: 'pt-BR' }

export const LANG_STORAGE_KEY = 'mcb:lang'

/** Saved choice first, then the browser language; English when nothing matches. */
export function detectLang(): Lang {
  try {
    const saved = localStorage.getItem(LANG_STORAGE_KEY)
    if (saved === 'en' || saved === 'pt' || saved === 'es') return saved
  } catch {
    // no storage (e.g. private mode): fall back to the browser language
  }
  for (const tag of navigator.languages ?? [navigator.language]) {
    const base = tag.toLowerCase().slice(0, 2)
    if (base === 'pt' || base === 'es' || base === 'en') return base
  }
  return 'en'
}

export type I18nValue = {
  lang: Lang
  locale: string
  t: Messages
  setLang: (lang: Lang) => void
  /** dates like "26 Oct 2026", in the current language */
  formatDate: (iso: string) => string
  /** ["a", "b", "c"] -> "a, b and c", in the current language */
  formatList: (items: string[]) => string
}

export const I18nContext = createContext<I18nValue | null>(null)

export function useI18n(): I18nValue {
  const value = useContext(I18nContext)
  if (!value) throw new Error('useI18n must be used inside <I18nProvider>')
  return value
}

/** Text for an error thrown by the API, in the current language. */
export function errorText(err: unknown, t: Messages): string {
  return err instanceof AppError ? t.errors[err.code] : t.generic
}
