import { useNavigate } from 'react-router'
import { useAuth } from '../auth/context'
import './DemoBanner.css'

/** Faixa que avisa que a pessoa está na estante de demonstração. */
export function DemoBanner() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  if (!user?.demo) return null

  return (
    <div className="demo-banner">
      <p>
        você está na <strong>estante de demonstração</strong>: pode mexer à vontade.
      </p>
      <button
        type="button"
        className="demo-banner__cta"
        onClick={async () => {
          await logout()
          navigate('/cadastro')
        }}
      >
        criar minha estante
      </button>
    </div>
  )
}
