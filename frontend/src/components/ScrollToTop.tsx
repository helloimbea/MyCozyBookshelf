import { useEffect } from 'react'
import { useLocation, useNavigationType } from 'react-router'

/** A new page opens at the top; the browser's back/forward keeps where the person was. */
export function ScrollToTop() {
  const { pathname } = useLocation()
  const navigationType = useNavigationType()

  useEffect(() => {
    if (navigationType !== 'POP') window.scrollTo(0, 0)
  }, [pathname, navigationType])

  return null
}
