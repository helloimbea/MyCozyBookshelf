import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { useAuth } from '../auth/context'
import { AuthLayout } from './AuthLayout'

export function Signup() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const from = (useLocation().state as { from?: string } | null)?.from ?? '/'
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (password.length < 8) return setError('a senha precisa ter pelo menos 8 dígitos.')
    if (password !== confirm) return setError('as senhas não são iguais.')
    setError('')
    setBusy(true)
    try {
      await register(name, email, password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'algo deu errado, tente de novo.')
      setBusy(false)
    }
  }

  return (
    <AuthLayout title="criar conta" greeting="que bom te conhecer!">
      <form onSubmit={handleSubmit}>
        <label className="field">
          <span className="field__label">me diga como devo te chamar</span>
          <input className="input" required autoComplete="nickname" placeholder="digite um nome" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label className="field">
          <span className="field__label">qual email você quer usar?</span>
          <input className="input" type="email" required autoComplete="email" placeholder="digite seu email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="field">
          <span className="field__label">crie uma senha</span>
          <span className="field__hint">mínimo 8 dígitos</span>
          <input className="input" type="password" required minLength={8} autoComplete="new-password" placeholder="digite uma senha" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <label className="field">
          <span className="field__label">confirme a senha</span>
          <input className="input" type="password" required autoComplete="new-password" placeholder="confirmar senha" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </label>
        {error && <p className="form-error">{error}</p>}
        <button type="submit" className="btn btn--primary" disabled={busy}>
          criar conta
        </button>
      </form>
      <p className="auth-card__switch">
        já tem uma conta? <Link to="/login" state={{ from }}>entrar</Link>
      </p>
    </AuthLayout>
  )
}
