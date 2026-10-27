import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router'
import chameleon from '../assets/chameleon.png'
import { useAuth } from '../auth/context'
import { useI18n } from '../i18n/context'
import { LanguageChoice, LanguageMenu } from './LanguageSwitch'
import { ThemeToggle } from './ThemeToggle'
import './Header.css'

export function Header() {
  const { user, logout } = useAuth()
  const { t } = useI18n()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const close = () => setMenuOpen(false)

  // on mobile the side menu locks the page scroll and closes with Esc
  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false)
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  async function handleLogout() {
    close()
    await logout()
    navigate('/')
  }

  return (
    <header className="header">
      <div className="header__inner">
        <Link to="/" className="header__brand" onClick={close}>
          <img src={chameleon} alt="" className="header__logo" />
          <span>my cozy bookshelf</span>
        </Link>

        <div className={menuOpen ? 'header__backdrop is-open' : 'header__backdrop'} onClick={close} aria-hidden="true" />

        <div className="header__actions">
          <nav id="main-menu" className={menuOpen ? 'header__nav is-open' : 'header__nav'} aria-label={t.nav.mainMenu}>
            <button type="button" className="header__close" aria-label={t.nav.closeMenu} onClick={close}>
              ×
            </button>
            <NavLink to="/" end className="header__link" onClick={close}>
              {t.nav.home}
            </NavLink>
            <NavLink to="/shelf" className="header__link" onClick={close}>
              {t.nav.shelf}
            </NavLink>
            <NavLink to="/add" className="header__link" onClick={close}>
              {t.nav.addBook}
            </NavLink>
            {user ? (
              <button type="button" className="header__link" onClick={handleLogout}>
                {t.nav.logout}
              </button>
            ) : (
              <NavLink to="/login" className="header__link" onClick={close}>
                {t.nav.login}
              </NavLink>
            )}
            <LanguageChoice />
          </nav>

          <LanguageMenu />
          <ThemeToggle />

          <button
            type="button"
            className="header__burger"
            aria-label={t.nav.openMenu}
            aria-expanded={menuOpen}
            aria-controls="main-menu"
            onClick={() => setMenuOpen(true)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  )
}
