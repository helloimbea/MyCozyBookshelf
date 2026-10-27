import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { useAuth } from '../auth/context'
import { DemoButton } from '../components/DemoButton'
import { errorText, useI18n } from '../i18n/context'
import { AuthLayout } from './AuthLayout'

export function Login() {
  const { login } = useAuth()
  const { t } = useI18n()
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
      setError(errorText(err, t))
      setBusy(false)
    }
  }

  return (
    <AuthLayout title={t.auth.loginTitle} greeting={t.auth.loginGreeting}>
      <form onSubmit={handleSubmit}>
        <label className="field">
          <span className="field__label">{t.auth.email}</span>
          <input className="input" type="email" required autoComplete="email" placeholder={t.auth.emailPlaceholder} value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="field">
          <span className="field__label">{t.auth.password}</span>
          <input className="input" type="password" required autoComplete="current-password" placeholder={t.auth.passwordPlaceholder} value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        {error && <p className="form-error">{error}</p>}
        <button type="submit" className="btn btn--primary" disabled={busy}>
          {t.auth.enter}
        </button>
      </form>
      <p className="auth-card__switch">
        {t.auth.noAccount}{' '}
        <Link to="/signup" state={{ from }}>
          {t.auth.createAccount}
        </Link>
      </p>
      <p className="auth-card__switch">
        {t.demo.justLooking} <DemoButton className="link-button" />
      </p>
    </AuthLayout>
  )
}
