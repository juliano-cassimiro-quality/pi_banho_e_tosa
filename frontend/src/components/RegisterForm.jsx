import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Input from './Input'
import Button from './Button'
import useAuth from '../hooks/useAuth'
import { getDefaultPath } from '../utils/navigation'

export default function RegisterForm ({ onSuccess, onOpenLogin, showLoginLink = true }) {
  const { register, login, loading } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ nome: '', telefone: '', email: '', senha: '' })
  const [error, setError] = useState('')

  const handleChange = event => {
    const { name, value } = event.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async event => {
    event.preventDefault()
    setError('')
    try {
      await register(form)
      const data = await login({ email: form.email, senha: form.senha })
      const usuario = data?.usuario
      const defaultPath = getDefaultPath(usuario?.role)

      if (onSuccess) {
        onSuccess({ usuario, defaultPath })
      } else {
        navigate(defaultPath)
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Não foi possível realizar o cadastro')
    }
  }

  return (
    <div className="space-y-5">
      <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
        <Input
          label="Nome completo"
          name="nome"
          value={form.nome}
          onChange={handleChange}
          required
        />
        <Input
          label="Telefone"
          name="telefone"
          value={form.telefone}
          onChange={handleChange}
          required
        />
        <Input
          label="E-mail"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <Input
          label="Senha"
          name="senha"
          type="password"
          value={form.senha}
          onChange={handleChange}
          required
        />
        {error && <p className="md:col-span-2 text-sm text-red-500">{error}</p>}
        <Button type="submit" className="md:col-span-2 w-full" disabled={loading}>
          {loading ? 'Cadastrando...' : 'Criar conta e acessar'}
        </Button>
      </form>
      {showLoginLink && (
        <p className="text-center text-sm text-slate-500">
          Já possui conta?
          {' '}
          <button
            type="button"
            onClick={onOpenLogin}
            className="font-medium text-primary-600 transition hover:text-primary-700"
          >
            Faça login
          </button>
        </p>
      )}
    </div>
  )
}
