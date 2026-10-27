import { useEffect, useRef, useState } from 'react'
import { LANGS, LOCALES, MESSAGES, useI18n } from '../i18n/context'
import './LanguageSwitch.css'

function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  )
}

/** Desktop: a small globe button that opens the list of languages. */
export function LanguageMenu() {
  const { lang, setLang, t } = useI18n()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // closes when clicking outside or pressing Esc
  useEffect(() => {
    if (!open) return
    const onPointer = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className="lang-menu" ref={ref}>
      <button
        type="button"
        className="lang-menu__button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`${t.nav.language}: ${t.langName}`}
        title={t.nav.language}
        onClick={() => setOpen((o) => !o)}
      >
        <GlobeIcon />
        <span>{lang}</span>
      </button>
      {open && (
        <ul className="lang-menu__list" role="menu" aria-label={t.nav.language}>
          {LANGS.map((l) => (
            <li key={l} role="none">
              <button
                type="button"
                role="menuitemradio"
                aria-checked={l === lang}
                lang={LOCALES[l]}
                onClick={() => {
                  setLang(l)
                  setOpen(false)
                }}
              >
                {MESSAGES[l].langName}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

/** Mobile side menu: the three languages side by side. */
export function LanguageChoice() {
  const { lang, setLang, t } = useI18n()

  return (
    <div className="lang-choice">
      <span className="lang-choice__label">
        <GlobeIcon /> {t.nav.language}
      </span>
      <div className="segmented" role="radiogroup" aria-label={t.nav.language}>
        {LANGS.map((l) => (
          <button key={l} type="button" role="radio" aria-checked={l === lang} lang={LOCALES[l]} onClick={() => setLang(l)}>
            {MESSAGES[l].langName}
          </button>
        ))}
      </div>
    </div>
  )
}
