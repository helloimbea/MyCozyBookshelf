import { useEffect } from 'react'
import { useLocation, useNavigationType } from 'react-router'

/** Página nova abre no topo; voltar/avançar no navegador mantém onde a pessoa estava. */
export function ScrollToTop() {
  const { pathname } = useLocation()
  const navigationType = useNavigationType()

  useEffect(() => {
    if (navigationType !== 'POP') window.scrollTo(0, 0)
  }, [pathname, navigationType])

  return null
}
