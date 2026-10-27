import { createContext, useContext } from 'react'
import type { Lang } from '../i18n/context'
import type { User } from '../types'

export type AuthValue = {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  /** opens the demo shelf in the given language */
  startDemo: (lang: Lang) => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthValue | null>(null)

export function useAuth(): AuthValue {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth must be used inside <AuthProvider>')
  return value
}
