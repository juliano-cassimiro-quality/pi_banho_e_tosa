import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import Input from '../components/Input'
import useAuth from '../hooks/useAuth'

export default function RegisterPage () {
  const { register, login, loading } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ nome: '', telefone: '', email: '', senha: '' })
  const [error, setError] = useState('')

  const handleChange = event => {
    setForm(prev => ({ ...prev, [event.target.name]: event.target.value }))
  }

  const handleSubmit = async event => {
    event.preventDefault()
    setError('')
    try {
      await register(form)
      await login({ email: form.email, senha: form.senha })
      navigate('/agendamentos')
    } catch (err) {
      setError(err.response?.data?.error || 'Não foi possível realizar o cadastro')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 to-white px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-slate-900">Crie sua conta</h1>
          <p className="mt-2 text-sm text-slate-500">Cadastre seus pets e agende serviços personalizados.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Nome completo" name="nome" value={form.nome} onChange={handleChange} required />
          <Input label="Telefone" name="telefone" value={form.telefone} onChange={handleChange} required />
          <Input label="E-mail" name="email" type="email" value={form.email} onChange={handleChange} required />
          <Input label="Senha" name="senha" type="password" value={form.senha} onChange={handleChange} required />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">
          Já possui conta?{' '}
          <Link to="/login" className="font-medium text-primary-600 hover:text-primary-700">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  )
}
