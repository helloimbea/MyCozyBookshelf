import type { ReactNode } from 'react'
import chameleon from '../assets/chameleon.png'
import './auth.css'

/** Layout of the login and sign-up screens: big chameleon on the left, brown-framed card on the right. */
export function AuthLayout({ title, greeting, children }: { title: string; greeting: string; children: ReactNode }) {
  return (
    <section className="auth">
      <img src={chameleon} alt="" className="auth__mascot" />
      <div className="auth-card">
        <p className="auth-card__brand">my cozy bookshelf</p>
        <h1>{title}</h1>
        <p className="auth-card__greeting">{greeting}</p>
        {children}
      </div>
    </section>
  )
}
