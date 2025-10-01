import React, { useState } from 'react'
import Card from '../components/Card'
import PageHeader from '../components/PageHeader'
import Input from '../components/Input'
import Button from '../components/Button'
import useAuth from '../hooks/useAuth'
import api from '../services/api'

export default function ManagementPage () {
  const { user } = useAuth()
  const [profissionalForm, setProfissionalForm] = useState({ nome: '', telefone: '', email: '', senha: '' })
  const [servicoForm, setServicoForm] = useState({ nomeServico: '', descricao: '', valor: '', tempoEstimado: '' })
  const [feedback, setFeedback] = useState({ profissional: '', servico: '' })
  const [loading, setLoading] = useState({ profissional: false, servico: false })

  if (!['profissional', 'admin'].includes(user?.role)) {
    return (
      <div className="rounded-[32px] border border-neutral-600/40 bg-surface-200/80 p-8 text-center text-neutral-100 shadow-card">
        <h2 className="text-xl font-semibold text-white">Acesso restrito</h2>
        <p className="mt-2 text-sm text-neutral-400">
          Somente profissionais autorizados podem cadastrar pessoas e serviços.
        </p>
      </div>
    )
  }

  const handleProfissionalChange = event => {
    const { name, value } = event.target
    setProfissionalForm(prev => ({ ...prev, [name]: value }))
  }

  const handleServicoChange = event => {
    const { name, value } = event.target
    setServicoForm(prev => ({ ...prev, [name]: value }))
  }

  const handleCadastrarProfissional = async event => {
    event.preventDefault()
    setLoading(prev => ({ ...prev, profissional: true }))
    setFeedback(prev => ({ ...prev, profissional: '' }))
    try {
      await api.post('/profissionais', profissionalForm)
      setFeedback(prev => ({ ...prev, profissional: 'Profissional cadastrado com sucesso!' }))
      setProfissionalForm({ nome: '', telefone: '', email: '', senha: '' })
    } catch (error) {
      setFeedback(prev => ({ ...prev, profissional: error.response?.data?.error || 'Não foi possível cadastrar o profissional' }))
    } finally {
      setLoading(prev => ({ ...prev, profissional: false }))
    }
  }

  const handleCadastrarServico = async event => {
    event.preventDefault()
    setLoading(prev => ({ ...prev, servico: true }))
    setFeedback(prev => ({ ...prev, servico: '' }))
    try {
      await api.post('/servicos', {
        ...servicoForm,
        valor: servicoForm.valor ? Number(servicoForm.valor) : null,
        tempoEstimado: servicoForm.tempoEstimado ? Number(servicoForm.tempoEstimado) : undefined
      })
      setFeedback(prev => ({ ...prev, servico: 'Serviço cadastrado com sucesso!' }))
      setServicoForm({ nomeServico: '', descricao: '', valor: '', tempoEstimado: '' })
    } catch (error) {
      setFeedback(prev => ({ ...prev, servico: error.response?.data?.error || 'Não foi possível cadastrar o serviço' }))
    } finally {
      setLoading(prev => ({ ...prev, servico: false }))
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Gestão de cadastros"
        description="Cadastre novos profissionais e serviços disponíveis na clínica."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Cadastrar novo profissional">
          <form onSubmit={handleCadastrarProfissional} className="space-y-4">
            <Input label="Nome" name="nome" value={profissionalForm.nome} onChange={handleProfissionalChange} required />
            <Input label="Telefone" name="telefone" value={profissionalForm.telefone} onChange={handleProfissionalChange} />
            <Input label="E-mail" name="email" type="email" value={profissionalForm.email} onChange={handleProfissionalChange} required />
            <Input label="Senha" name="senha" type="password" value={profissionalForm.senha} onChange={handleProfissionalChange} required />
            {feedback.profissional && <p className="text-sm text-neutral-300">{feedback.profissional}</p>}
            <Button type="submit" className="w-full" disabled={loading.profissional}>
              {loading.profissional ? 'Cadastrando...' : 'Cadastrar profissional'}
            </Button>
          </form>
        </Card>

        <Card title="Cadastrar novo serviço">
          <form onSubmit={handleCadastrarServico} className="space-y-4">
            <Input label="Nome do serviço" name="nomeServico" value={servicoForm.nomeServico} onChange={handleServicoChange} required />
            <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-wide text-neutral-400">
              <span>Descrição</span>
              <textarea
                name="descricao"
                value={servicoForm.descricao}
                onChange={handleServicoChange}
                className="min-h-[120px] rounded-2xl border border-neutral-600/40 bg-surface-100/70 px-4 py-3 text-sm text-neutral-100 shadow-card focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/40"
              />
            </label>
            <Input
              label="Valor (R$)"
              name="valor"
              type="number"
              step="0.01"
              value={servicoForm.valor}
              onChange={handleServicoChange}
            />
            <Input
              label="Tempo estimado (min)"
              name="tempoEstimado"
              type="number"
              value={servicoForm.tempoEstimado}
              onChange={handleServicoChange}
            />
            {feedback.servico && <p className="text-sm text-neutral-300">{feedback.servico}</p>}
            <Button type="submit" className="w-full" disabled={loading.servico}>
              {loading.servico ? 'Cadastrando...' : 'Cadastrar serviço'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}
