import { useState } from 'react'
import { useI18n } from '../i18n/context'
import { getTheme, setTheme, type Theme } from '../theme'

export function ThemeToggle() {
  const { t } = useI18n()
  const [theme, setThemeState] = useState<Theme>(getTheme)
  const next: Theme = theme === 'dark' ? 'light' : 'dark'
  const label = next === 'dark' ? t.nav.toDark : t.nav.toLight

  return (
    <button
      type="button"
      className="header__theme"
      aria-label={label}
      title={label}
      onClick={() => {
        setTheme(next)
        setThemeState(next)
      }}
    >
      {theme === 'dark' ? (
        // sun
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="4.5" fill="currentColor" />
          <g stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
          </g>
        </svg>
      ) : (
        // moon
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" fill="currentColor" />
        </svg>
      )}
    </button>
  )
}
