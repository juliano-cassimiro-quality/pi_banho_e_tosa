import React, { createContext, useContext, useEffect, useState } from 'react'
import api from '../services/api'

const AuthContext = createContext()

export function AuthProvider ({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('auth_user')
    return stored ? JSON.parse(stored) : null
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

  async function login ({ email, senha, role }) {
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', { email, senha, role })
      const payload = data.cliente
        ? { role: 'cliente', ...data.cliente }
        : data.profissional
          ? { role: 'profissional', ...data.profissional }
          : null

      if (!payload) {
        throw new Error('Resposta de autenticação inválida')
      }
      setUser(payload)
      setToken(data.token)
      return data
    } finally {
      setLoading(false)
    }
  }

  async function register ({ nome, telefone, email, senha }) {
    setLoading(true)
    try {
      const { data } = await api.post('/clientes', { nome, telefone, email, senha })
      return data
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
    role: user?.role,
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
