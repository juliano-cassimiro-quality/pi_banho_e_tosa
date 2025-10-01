import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import Input from '../components/Input'
import useAuth from '../hooks/useAuth'
import api from '../services/api'

export default function LoginPage () {
  const { login, loading } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', senha: '', role: 'cliente' })
  const [error, setError] = useState('')
  const [recoveryMessage, setRecoveryMessage] = useState('')

  const handleChange = event => {
    setForm(prev => ({ ...prev, [event.target.name]: event.target.value }))
  }

  const handleSubmit = async event => {
    event.preventDefault()
    setError('')
    try {
      await login(form)
      navigate('/agendamentos')
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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 to-white px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-slate-900">Acesse sua conta</h1>
          <p className="mt-2 text-sm text-slate-500">Gerencie agendamentos de banho e tosa com facilidade.</p>
        </div>
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
          <div>
            <label htmlFor="role" className="mb-1 block text-sm font-medium text-slate-700">
              Tipo de acesso
            </label>
            <select
              id="role"
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
            >
              <option value="cliente">Cliente</option>
              <option value="profissional">Profissional</option>
            </select>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
        <button
          type="button"
          onClick={handleRecovery}
          className="mt-4 text-sm text-primary-600 hover:text-primary-700"
        >
          Esqueci minha senha
        </button>
        {recoveryMessage && <p className="mt-2 text-xs text-slate-500">{recoveryMessage}</p>}
        <p className="mt-6 text-center text-sm text-slate-500">
          Ainda não possui conta?{' '}
          <Link to="/cadastro" className="font-medium text-primary-600 hover:text-primary-700">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  )
}
