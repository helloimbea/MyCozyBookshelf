import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { useAuth } from '../auth/context'
import { AuthLayout } from './AuthLayout'

export function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const from = (useLocation().state as { from?: string } | null)?.from ?? '/'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await login(email, password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'algo deu errado, tente de novo.')
      setBusy(false)
    }
  }

  return (
    <AuthLayout title="login" greeting="oi amigo, que bom ter você de volta!">
      <form onSubmit={handleSubmit}>
        <label className="field">
          <span className="field__label">email</span>
          <input className="input" type="email" required autoComplete="email" placeholder="digite seu email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="field">
          <span className="field__label">senha</span>
          <input className="input" type="password" required autoComplete="current-password" placeholder="digite sua senha" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        {error && <p className="form-error">{error}</p>}
        <button type="submit" className="btn btn--primary" disabled={busy}>
          entrar
        </button>
      </form>
      <p className="auth-card__switch">
        não tem uma conta? <Link to="/cadastro" state={{ from }}>criar conta</Link>
      </p>
    </AuthLayout>
  )
}
