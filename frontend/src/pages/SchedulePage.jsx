import React, { useEffect, useMemo, useState } from 'react'
import Card from '../components/Card'
import Button from '../components/Button'
import Input from '../components/Input'
import PageHeader from '../components/PageHeader'
import useAuth from '../hooks/useAuth'
import api from '../services/api'
import dayjs from 'dayjs'

export default function SchedulePage () {
  const { user } = useAuth()
  const isCliente = user?.role === 'cliente'
  const [pets, setPets] = useState([])
  const [servicos, setServicos] = useState([])
  const [profissionais, setProfissionais] = useState([])
  const [slots, setSlots] = useState([])
  const [form, setForm] = useState({
    idAnimal: '',
    idServico: '',
    idProfissional: '',
    data: dayjs().format('YYYY-MM-DD'),
    horario: ''
  })
  const [observacoes, setObservacoes] = useState('')
  const [feedback, setFeedback] = useState('')
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchInitialData = async () => {
      const [petsRes, servicosRes, profRes] = await Promise.all([
        api.get(`/animais/cliente/${user.id_cliente}`),
        api.get('/servicos'),
        api.get('/profissionais')
      ])
      setPets(petsRes.data)
      setServicos(servicosRes.data)
      setProfissionais(profRes.data)
      if (petsRes.data[0]) {
        setForm(prev => ({ ...prev, idAnimal: petsRes.data[0].id_animal }))
      }
      if (servicosRes.data[0]) {
        setForm(prev => ({ ...prev, idServico: servicosRes.data[0].id_servico }))
      }
      if (profRes.data[0]) {
        setForm(prev => ({ ...prev, idProfissional: profRes.data[0].id_profissional }))
      }
    }
    if (isCliente && user?.id_cliente) {
      fetchInitialData()
    }
  }, [user, isCliente])

  const canLoadSlots = useMemo(() => {
    return form.idServico && form.idProfissional && form.data
  }, [form.idServico, form.idProfissional, form.data])

  useEffect(() => {
    const fetchSlots = async () => {
      if (!canLoadSlots) return
      setLoadingSlots(true)
      try {
        const params = new URLSearchParams({
          idProfissional: form.idProfissional,
          data: form.data,
          idServico: form.idServico
        })
        const { data } = await api.get(`/agendamentos/disponiveis?${params.toString()}`)
        setSlots(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoadingSlots(false)
      }
    }
    fetchSlots()
  }, [form.idProfissional, form.idServico, form.data, canLoadSlots])

  const handleChange = event => {
    const { name, value } = event.target
    setForm(prev => {
      const updated = { ...prev, [name]: value }
      if (name === 'data') {
        updated.horario = ''
      }
      return updated
    })
  }

  const handleSubmit = async event => {
    event.preventDefault()
    setFeedback('')
    setSaving(true)
    try {
      if (!isCliente) {
        throw new Error('Somente clientes podem agendar serviços')
      }
      await api.post('/agendamentos', {
        idCliente: user.id_cliente,
        idAnimal: form.idAnimal,
        idServico: form.idServico,
        idProfissional: form.idProfissional,
        dataHorario: form.horario,
        observacoes
      })
      setFeedback('Agendamento criado com sucesso!')
      setObservacoes('')
    } catch (err) {
      setFeedback(err.response?.data?.error || 'Não foi possível criar o agendamento')
    } finally {
      setSaving(false)
    }
  }

  if (!isCliente) {
    return (
      <div>
        <PageHeader
          title="Agendar serviço"
          description="O agendamento está disponível somente para clientes autenticados."
        />
        <Card>
          <p className="text-sm text-slate-500">
            Utilize uma conta de cliente para selecionar pets e horários disponíveis.
          </p>
        </Card>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="Agendar serviço"
        description="Escolha o pet, serviço, profissional e horário disponível para confirmar o atendimento."
      />
      <Card>
        <form className="grid gap-6 md:grid-cols-2" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-1 text-sm font-medium text-slate-600">
            <span>Pet</span>
            <select
              name="idAnimal"
              value={form.idAnimal}
              onChange={handleChange}
              className="rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
            >
              <option value="">Selecione</option>
              {pets.map(pet => (
                <option key={pet.id_animal} value={pet.id_animal}>
                  {pet.nome}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium text-slate-600">
            <span>Serviço</span>
            <select
              name="idServico"
              value={form.idServico}
              onChange={handleChange}
              className="rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
            >
              <option value="">Selecione</option>
              {servicos.map(servico => (
                <option key={servico.id_servico} value={servico.id_servico}>
                  {servico.nome_servico}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium text-slate-600">
            <span>Profissional</span>
            <select
              name="idProfissional"
              value={form.idProfissional}
              onChange={handleChange}
              className="rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
            >
              <option value="">Selecione</option>
              {profissionais.map(profissional => (
                <option key={profissional.id_profissional} value={profissional.id_profissional}>
                  {profissional.nome}
                </option>
              ))}
            </select>
          </label>
          <Input label="Data" type="date" name="data" value={form.data} onChange={handleChange} min={dayjs().format('YYYY-MM-DD')} />

          <div className="md:col-span-2">
            <span className="block text-sm font-medium text-slate-600">Horário disponível</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {loadingSlots && <p className="text-sm text-slate-500">Carregando horários...</p>}
              {!loadingSlots && slots.length === 0 && (
                <p className="text-sm text-slate-500">Nenhum horário disponível para os filtros selecionados.</p>
              )}
              {slots.map(slot => (
                <button
                  key={slot.start}
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, horario: slot.start }))}
                  className={`rounded-md border px-3 py-2 text-sm ${
                    form.horario === slot.start
                      ? 'border-primary-400 bg-primary-100 text-primary-700'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-primary-200'
                  }`}
                >
                  {dayjs(slot.start).format('DD/MM/YYYY HH:mm')}
                </button>
              ))}
            </div>
          </div>

          <label className="md:col-span-2 flex flex-col gap-1 text-sm font-medium text-slate-600">
            <span>Observações</span>
            <textarea
              value={observacoes}
              onChange={event => setObservacoes(event.target.value)}
              className="min-h-[100px] rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
            />
          </label>

          <div className="md:col-span-2 flex items-center justify-between gap-4">
            {feedback && <p className="text-sm text-slate-500">{feedback}</p>}
            <Button type="submit" disabled={!form.horario || saving}>
              {saving ? 'Agendando...' : 'Confirmar agendamento'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
