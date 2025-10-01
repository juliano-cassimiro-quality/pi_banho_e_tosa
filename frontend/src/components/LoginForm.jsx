import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Input from './Input'
import Button from './Button'
import useAuth from '../hooks/useAuth'
import api from '../services/api'
import { getDefaultPath } from '../utils/navigation'

export default function LoginForm ({ onSuccess, showRegisterLink = true, onOpenRegister }) {
  const { login, loading } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', senha: '' })
  const [error, setError] = useState('')
  const [recoveryMessage, setRecoveryMessage] = useState('')

  const handleChange = event => {
    setForm(prev => ({ ...prev, [event.target.name]: event.target.value }))
  }

  const handleSubmit = async event => {
    event.preventDefault()
    setError('')
    try {
      const data = await login(form)
      const usuario = data?.usuario
      const defaultPath = getDefaultPath(usuario?.role)

      if (onSuccess) {
        onSuccess({ usuario, defaultPath })
      } else {
        navigate(defaultPath)
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Não foi possível realizar login')
    }
  }

  const handleRecovery = async () => {
    if (!form.email) {
      setRecoveryMessage('Informe um e-mail para recuperar a senha.')
      return
    }

    try {
      await api.post('/auth/recovery', { email: form.email })
      setRecoveryMessage('Se o e-mail estiver cadastrado, um token foi enviado (verifique o console da API).')
    } catch (err) {
      setRecoveryMessage(err.response?.data?.error || 'Erro ao solicitar recuperação.')
    }
  }

  return (
    <div className="space-y-5">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="E-mail"
          name="email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <Input
          label="Senha"
          name="senha"
          type="password"
          autoComplete="current-password"
          value={form.senha}
          onChange={handleChange}
          required
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </Button>
      </form>
      <div className="space-y-2 text-center text-sm">
        <button
          type="button"
          onClick={handleRecovery}
          className="font-medium text-primary-600 transition hover:text-primary-700"
        >
          Esqueci minha senha
        </button>
        {recoveryMessage && <p className="text-xs text-slate-500">{recoveryMessage}</p>}
        {showRegisterLink && (
          <p className="text-slate-500">
            Ainda não possui conta?{' '}
            {onOpenRegister ? (
              <button
                type="button"
                onClick={onOpenRegister}
                className="font-medium text-primary-600 transition hover:text-primary-700"
              >
                Cadastre-se
              </button>
            ) : (
              <Link to="/cadastro" className="font-medium text-primary-600 hover:text-primary-700">
                Cadastre-se
              </Link>
            )}
          </p>
        )}
      </div>
    </div>
  )
}
