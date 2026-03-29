import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => {
    // Check localStorage on initial load (synchronous)
    return localStorage.getItem('token')
  })
  const [loading, setLoading] = useState(false) // Start as false for instant load

  useEffect(() => {
    // If we already have a token from initial state, set user immediately
    if (token) {
      const email = localStorage.getItem('email') || 'guest@local'
      setUser({ email })
      setLoading(false)
      return
    }

    // No token - create a temporary guest token immediately
    const guestToken = 'temp_guest_' + Date.now()
    const guestEmail = 'guest_' + Date.now() + '@local'
    localStorage.setItem('token', guestToken)
    localStorage.setItem('email', guestEmail)
    setToken(guestToken)
    setUser({ email: guestEmail })
    setLoading(false)
  }, [])

  const login = (accessToken, email) => {
    localStorage.setItem('token', accessToken)
    localStorage.setItem('email', email)
    setToken(accessToken)
    setUser({ email })
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('email')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
