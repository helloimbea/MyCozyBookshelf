import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router'
import camaleao from '../assets/camaleao.png'
import { useAuth } from '../auth/context'
import { ThemeToggle } from './ThemeToggle'
import './Header.css'

export function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const close = () => setMenuOpen(false)

  // no celular o menu lateral trava a rolagem da página e fecha com Esc
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
          <img src={camaleao} alt="" className="header__logo" />
          <span>my cozy bookshelf</span>
        </Link>

        <div className={menuOpen ? 'header__backdrop is-open' : 'header__backdrop'} onClick={close} aria-hidden="true" />

        <div className="header__actions">
          <nav id="menu-principal" className={menuOpen ? 'header__nav is-open' : 'header__nav'} aria-label="menu principal">
            <button type="button" className="header__close" aria-label="fechar menu" onClick={close}>
              ×
            </button>
            <NavLink to="/" end className="header__link" onClick={close}>
              início
            </NavLink>
            <NavLink to="/estante" className="header__link" onClick={close}>
              minha estante
            </NavLink>
            <NavLink to="/adicionar" className="header__link" onClick={close}>
              adicionar livro
            </NavLink>
            {user ? (
              <button type="button" className="header__link" onClick={handleLogout}>
                sair
              </button>
            ) : (
              <NavLink to="/login" className="header__link" onClick={close}>
                login
              </NavLink>
            )}
          </nav>

          <ThemeToggle />

          <button
            type="button"
            className="header__burger"
            aria-label="abrir menu"
            aria-expanded={menuOpen}
            aria-controls="menu-principal"
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
