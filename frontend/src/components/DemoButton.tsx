import { useNavigate } from 'react-router'
import { useAuth } from '../auth/context'

/** Abre a estante de demonstração, já cheia de livros de exemplo. */
export function DemoButton({ className = 'btn btn--ghost' }: { className?: string }) {
  const { startDemo } = useAuth()
  const navigate = useNavigate()

  return (
    <button
      type="button"
      className={className}
      onClick={async () => {
        await startDemo()
        navigate('/estante')
      }}
    >
      ver demonstração
    </button>
  )
}
