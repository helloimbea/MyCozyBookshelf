import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { useAuth } from '../auth/context'
import { errorText, useI18n } from '../i18n/context'
import { AuthLayout } from './AuthLayout'

export function Signup() {
  const { register } = useAuth()
  const { t } = useI18n()
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
    if (password.length < 8) return setError(t.errors.shortPassword)
    if (password !== confirm) return setError(t.auth.passwordsDiffer)
    setError('')
    setBusy(true)
    try {
      await register(name, email, password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(errorText(err, t))
      setBusy(false)
    }
  }

  return (
    <AuthLayout title={t.auth.signupTitle} greeting={t.auth.signupGreeting}>
      <form onSubmit={handleSubmit}>
        <label className="field">
          <span className="field__label">{t.auth.nameLabel}</span>
          <input className="input" required autoComplete="nickname" placeholder={t.auth.namePlaceholder} value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label className="field">
          <span className="field__label">{t.auth.emailQuestion}</span>
          <input className="input" type="email" required autoComplete="email" placeholder={t.auth.emailPlaceholder} value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="field">
          <span className="field__label">{t.auth.newPassword}</span>
          <span className="field__hint">{t.auth.passwordHint}</span>
          <input className="input" type="password" required minLength={8} autoComplete="new-password" placeholder={t.auth.newPasswordPlaceholder} value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <label className="field">
          <span className="field__label">{t.auth.confirmPassword}</span>
          <input className="input" type="password" required autoComplete="new-password" placeholder={t.auth.confirmPlaceholder} value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </label>
        {error && <p className="form-error">{error}</p>}
        <button type="submit" className="btn btn--primary" disabled={busy}>
          {t.auth.createAccount}
        </button>
      </form>
      <p className="auth-card__switch">
        {t.auth.haveAccount}{' '}
        <Link to="/login" state={{ from }}>
          {t.auth.enter}
        </Link>
      </p>
    </AuthLayout>
  )
}
