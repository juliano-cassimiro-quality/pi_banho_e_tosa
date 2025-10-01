import React, { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Card from '../components/Card'
import Button from '../components/Button'
import Input from '../components/Input'
import PageHeader from '../components/PageHeader'
import useAuth from '../hooks/useAuth'
import api from '../services/api'
import dayjs from 'dayjs'

const SERVICOS = [
  { value: 'BANHO', label: 'Banho completo' },
  { value: 'TOSA', label: 'Tosa higiênica' },
  { value: 'BANHO_E_TOSA', label: 'Banho + tosa completa' }
]

export default function SchedulePage () {
  const { user } = useAuth()
  const location = useLocation()
  const [pets, setPets] = useState([])
  const [slots, setSlots] = useState([])
  const [form, setForm] = useState({
    idAnimal: '',
    tipoServico: SERVICOS[0].value,
    data: dayjs().format('YYYY-MM-DD'),
    horario: ''
  })
  const [observacoes, setObservacoes] = useState('')
  const [feedback, setFeedback] = useState('')
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [saving, setSaving] = useState(false)
  const [appliedPrefill, setAppliedPrefill] = useState(null)

  const prefill = location.state?.prefill

  useEffect(() => {
    const fetchPets = async () => {
      const { data } = await api.get('/pets')
      setPets(data)
      if (data[0]) {
        setForm(prev => ({ ...prev, idAnimal: data[0].id }))
      }
    }
    if (user) {
      fetchPets()
    }
  }, [user])

  useEffect(() => {
    if (!prefill || appliedPrefill === prefill) return
    setForm(prev => ({
      ...prev,
      data: prefill.data || prev.data,
      horario: prefill.horario || prev.horario,
      tipoServico: prefill.tipoServico || prev.tipoServico
    }))
    setAppliedPrefill(prefill)
  }, [prefill, appliedPrefill])

  const canLoadSlots = useMemo(() => {
    return Boolean(form.tipoServico && form.data)
  }, [form.tipoServico, form.data])

  useEffect(() => {
    const fetchSlots = async () => {
      if (!canLoadSlots) return
      setLoadingSlots(true)
      try {
        const params = new URLSearchParams({
          date: form.data,
          serviceType: form.tipoServico
        })
        const { data } = await api.get(`/appointments/availability?${params.toString()}`)
        setSlots(data)
      } catch (error) {
        console.error('Erro ao carregar disponibilidade', error)
        setSlots([])
      } finally {
        setLoadingSlots(false)
      }
    }
    fetchSlots()
  }, [canLoadSlots, form.tipoServico, form.data])

  const handleChange = event => {
    const { name, value } = event.target
    setForm(prev => {
      const updated = { ...prev, [name]: value }
      if (name === 'data' || name === 'tipoServico') {
        updated.horario = ''
      }
      return updated
    })
  }

  const handleSubmit = async event => {
    event.preventDefault()
    setFeedback('')

    if (!form.idAnimal) {
      setFeedback('Cadastre um pet para realizar o agendamento.')
      return
    }

    if (!form.horario) {
      setFeedback('Selecione um horário disponível para concluir o agendamento.')
      return
    }

    setSaving(true)
    try {
      await api.post('/appointments', {
        animalId: form.idAnimal,
        tipoServico: form.tipoServico,
        dataHora: form.horario,
        observacoesCliente: observacoes
      })
      setFeedback('Agendamento criado com sucesso!')
      setObservacoes('')
    } catch (err) {
      setFeedback(err.response?.data?.message || 'Não foi possível criar o agendamento')
    } finally {
      setSaving(false)
    }
  }

  const horariosDisponiveis = slots.map(slot => ({
    inicio: slot.inicio,
    fim: slot.fim,
    label: `${dayjs(slot.inicio).format('DD/MM')} • ${dayjs(slot.inicio).format('HH:mm')} - ${dayjs(slot.fim).format('HH:mm')}`
  }))

  return (
    <div>
      <PageHeader
        title="Agendar serviço"
        description="Escolha o pet, o tipo de serviço e confirme o horário disponível."
      />
      <Card>
        <form className="grid gap-6 md:grid-cols-2" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-wide text-neutral-400">
            <span>Pet</span>
            <select
              name="idAnimal"
              value={form.idAnimal}
              onChange={handleChange}
              className="rounded-2xl border border-neutral-600/40 bg-surface-100/70 px-4 py-3 text-sm text-neutral-100 shadow-card focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/40"
            >
              <option value="">Selecione</option>
              {pets.map(pet => (
                <option key={pet.id} value={pet.id}>
                  {pet.nome}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-wide text-neutral-400">
            <span>Tipo de serviço</span>
            <select
              name="tipoServico"
              value={form.tipoServico}
              onChange={handleChange}
              className="rounded-2xl border border-neutral-600/40 bg-surface-100/70 px-4 py-3 text-sm text-neutral-100 shadow-card focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/40"
            >
              {SERVICOS.map(servico => (
                <option key={servico.value} value={servico.value}>
                  {servico.label}
                </option>
              ))}
            </select>
          </label>
          <Input label="Data" type="date" name="data" value={form.data} onChange={handleChange} min={dayjs().format('YYYY-MM-DD')} />

          <div className="md:col-span-2">
            <span className="block text-xs font-semibold uppercase tracking-wide text-neutral-400">Horários disponíveis</span>
            <div className="mt-3 flex flex-wrap gap-2">
              {loadingSlots && <p className="text-sm text-neutral-400">Carregando horários...</p>}
              {!loadingSlots && horariosDisponiveis.length === 0 && (
                <p className="text-sm text-neutral-400">Nenhum horário disponível para a data selecionada.</p>
              )}
              {horariosDisponiveis.map(slot => (
                <button
                  key={slot.inicio}
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, horario: slot.inicio }))}
                  className={`rounded-full border px-3 py-2 text-sm transition ${
                    form.horario === slot.inicio
                      ? 'border-accent-400 bg-accent-500 text-white shadow-elevated'
                      : 'border-neutral-600/40 bg-transparent text-neutral-300 hover:border-accent-400 hover:text-white'
                  }`}
                >
                  {slot.label}
                </button>
              ))}
            </div>
          </div>

          <label className="md:col-span-2 flex flex-col gap-2 text-xs font-semibold uppercase tracking-wide text-neutral-400">
            <span>Observações</span>
            <textarea
              value={observacoes}
              onChange={event => setObservacoes(event.target.value)}
              className="min-h-[120px] rounded-2xl border border-neutral-600/40 bg-surface-100/70 px-4 py-3 text-sm text-neutral-100 shadow-card focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/40"
            />
          </label>

          <div className="md:col-span-2 flex items-center justify-between gap-4">
            {feedback && <p className="text-sm text-neutral-300">{feedback}</p>}
            <Button type="submit" disabled={!form.horario || saving}>
              {saving ? 'Agendando...' : 'Confirmar agendamento'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
