import { useNavigate } from 'react-router'
import { useAuth } from '../auth/context'
import { useI18n } from '../i18n/context'

/** Opens the demo shelf, already full of sample books, in the current language. */
export function DemoButton({ className = 'btn btn--ghost' }: { className?: string }) {
  const { startDemo } = useAuth()
  const { lang, t } = useI18n()
  const navigate = useNavigate()

  return (
    <button
      type="button"
      className={className}
      onClick={async () => {
        await startDemo(lang)
        navigate('/shelf')
      }}
    >
      {t.demo.button}
    </button>
  )
}
