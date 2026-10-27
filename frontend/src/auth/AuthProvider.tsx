import { useMemo, useState, type ReactNode } from 'react'
import * as api from '../services/api'
import type { User } from '../types'
import { AuthContext, type AuthValue } from './context'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => api.getSessionUser())

  const value = useMemo<AuthValue>(
    () => ({
      user,
      login: async (email, password) => setUser(await api.login(email, password)),
      register: async (name, email, password) => setUser(await api.register(name, email, password)),
      startDemo: async (lang) => setUser(await api.startDemo(lang)),
      logout: async () => {
        await api.logout()
        setUser(null)
      },
    }),
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
