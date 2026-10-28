import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { AUTH_COOKIE_KEY, getCookie, setCookie, clearCookie } from '../utils/cookies'
import { setUnauthorizedHandler } from '../lib/apiClient'
import { queryClient } from '../lib/queryClient'

const AuthContext = createContext(undefined)

function hasAuthToken() {
  return Boolean(getCookie(AUTH_COOKIE_KEY))
}

export default function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => hasAuthToken())

  useEffect(() => {
    setUnauthorizedHandler(() => {
      clearCookie(AUTH_COOKIE_KEY)
      queryClient.clear()
      setIsAuthenticated(false)
    })
    return () => setUnauthorizedHandler(null)
  }, [])

  const setAuth = useCallback((authToken) => {
    setCookie(AUTH_COOKIE_KEY, authToken)
    setIsAuthenticated(true)
  }, [])

  const logout = useCallback(() => {
    clearCookie(AUTH_COOKIE_KEY)
    queryClient.clear()
    setIsAuthenticated(false)
  }, [])

  const value = useMemo(
    () => ({
      isAuthenticated,
      setAuth,
      logout,
    }),
    [isAuthenticated, setAuth, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
