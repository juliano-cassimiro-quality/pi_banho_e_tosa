import React, { createContext, useContext, useEffect, useState } from 'react'
import api from '../services/api'

const AuthContext = createContext()

export function AuthProvider ({ children }) {
  const normalizeUser = raw => {
    if (!raw) return null
    const role = typeof raw.role === 'string' ? raw.role.toLowerCase() : raw.role
    return { ...raw, role }
  }

  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('auth_user')
    return stored ? normalizeUser(JSON.parse(stored)) : null
  })
  const [token, setToken] = useState(() => localStorage.getItem('auth_token'))
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (token) {
      localStorage.setItem('auth_token', token)
    } else {
      localStorage.removeItem('auth_token')
    }
  }, [token])

  useEffect(() => {
    if (user) {
      localStorage.setItem('auth_user', JSON.stringify(user))
    } else {
      localStorage.removeItem('auth_user')
    }
  }, [user])

  const persistAuth = data => {
    const mappedUser = normalizeUser(data.usuario)
    setUser(mappedUser)
    setToken(data.token)
    return { ...data, usuario: mappedUser }
  }

  async function login ({ email, senha }) {
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', { email, senha })
      return persistAuth(data)
    } finally {
      setLoading(false)
    }
  }

  async function register ({ nome, telefone, email, senha }) {
    setLoading(true)
    try {
      const { data } = await api.post('/auth/register', { nome, telefone, email, senha })
      return persistAuth(data)
    } finally {
      setLoading(false)
    }
  }

  function logout () {
    setUser(null)
    setToken(null)
  }

  const value = {
    user,
    token,
    loading,
    isAuthenticated: Boolean(user && token),
    login,
    register,
    logout
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthContext () {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext deve ser usado dentro de AuthProvider')
  }
  return context
}
