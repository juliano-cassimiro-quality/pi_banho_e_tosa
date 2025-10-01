import React, { useEffect, useState } from 'react'
import Card from '../components/Card'
import Button from '../components/Button'
import Input from '../components/Input'
import PageHeader from '../components/PageHeader'
import Table from '../components/Table'
import useAuth from '../hooks/useAuth'
import api from '../services/api'

const columns = [
  { Header: 'Nome', accessor: 'nome' },
  { Header: 'Espécie', accessor: 'especie' },
  { Header: 'Porte', accessor: 'porte' },
  { Header: 'Idade', accessor: 'idade' },
  { Header: 'Observações', accessor: 'observacoes' }
]

export default function PetsPage () {
  const { user } = useAuth()
  const [pets, setPets] = useState([])
  const [form, setForm] = useState({ nome: '', especie: '', porte: '', idade: '', observacoes: '' })
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState('')

  const fetchPets = async () => {
    const { data } = await api.get(`/animais/cliente/${user.id_cliente}`)
    setPets(data)
  }

  useEffect(() => {
    if (user?.id_cliente) {
      fetchPets()
    }
  }, [user])

  const handleChange = event => {
    setForm(prev => ({ ...prev, [event.target.name]: event.target.value }))
  }

  const handleSubmit = async event => {
    event.preventDefault()
    setLoading(true)
    setFeedback('')
    try {
      await api.post('/animais', { ...form, idCliente: user.id_cliente, idade: Number(form.idade) || null })
      setForm({ nome: '', especie: '', porte: '', idade: '', observacoes: '' })
      setFeedback('Pet cadastrado com sucesso!')
      fetchPets()
    } catch (err) {
      setFeedback(err.response?.data?.error || 'Não foi possível cadastrar o pet')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <PageHeader title="Meus Pets" description="Cadastre e gerencie os animais vinculados à sua conta." />
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1" title="Cadastrar novo pet">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Nome" name="nome" value={form.nome} onChange={handleChange} required />
            <Input label="Espécie" name="especie" value={form.especie} onChange={handleChange} required />
            <Input label="Porte" name="porte" value={form.porte} onChange={handleChange} />
            <Input label="Idade" name="idade" type="number" value={form.idade} onChange={handleChange} />
            <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-wide text-neutral-400">
              <span>Observações</span>
              <textarea
                name="observacoes"
                value={form.observacoes}
                onChange={handleChange}
                className="min-h-[120px] rounded-2xl border border-neutral-600/40 bg-surface-100/70 px-4 py-3 text-sm text-neutral-100 shadow-card focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/40"
              />
            </label>
            {feedback && <p className="text-sm text-neutral-300">{feedback}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar pet'}
            </Button>
          </form>
        </Card>
        <Card className="lg:col-span-2" title="Lista de pets">
          <Table columns={columns} data={pets} emptyMessage="Nenhum pet cadastrado." />
        </Card>
      </div>
    </div>
  )
}
