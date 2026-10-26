import type { ReactNode } from 'react'
import camaleao from '../assets/camaleao.png'
import './auth.css'

/** Layout das telas de login e cadastro: camaleão grande à esquerda, card com moldura marrom à direita. */
export function AuthLayout({ title, greeting, children }: { title: string; greeting: string; children: ReactNode }) {
  return (
    <section className="auth">
      <img src={camaleao} alt="" className="auth__mascot" />
      <div className="auth-card">
        <p className="auth-card__brand">my cozy bookshelf</p>
        <h1>{title}</h1>
        <p className="auth-card__greeting">{greeting}</p>
        {children}
      </div>
    </section>
  )
}
