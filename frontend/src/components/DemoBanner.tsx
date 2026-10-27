import { useNavigate } from 'react-router'
import { useAuth } from '../auth/context'
import { useI18n } from '../i18n/context'
import './DemoBanner.css'

/** Strip telling the person they are on the demo shelf. */
export function DemoBanner() {
  const { user, logout } = useAuth()
  const { t } = useI18n()
  const navigate = useNavigate()
  if (!user?.demo) return null

  return (
    <div className="demo-banner">
      <p>
        {t.demo.bannerBefore}
        <strong>{t.demo.bannerStrong}</strong>
        {t.demo.bannerAfter}
      </p>
      <button
        type="button"
        className="demo-banner__cta"
        onClick={async () => {
          await logout()
          navigate('/signup')
        }}
      >
        {t.demo.createMine}
      </button>
    </div>
  )
}
