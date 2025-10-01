import React, { useEffect, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import { CalendarDaysIcon, ClockIcon, SparklesIcon } from '@heroicons/react/24/outline'
import api from '../services/api'
import Button from './Button'
import Input from './Input'

const SERVICOS = [
  { value: 'BANHO', label: 'Banho relaxante', descricao: 'Limpeza completa com hidratação e perfume hipoalergênico.' },
  { value: 'TOSA', label: 'Tosa personalizada', descricao: 'Acabamento sob medida e cuidados especiais com a pelagem.' },
  { value: 'BANHO_E_TOSA', label: 'Banho + tosa', descricao: 'Combo completo para deixar o pet limpo, cheiroso e estiloso.' }
]

export default function LandingScheduleWidget ({ isAuthenticated, onRequireAuth }) {
  const [pets, setPets] = useState([])
  const [servico, setServico] = useState(SERVICOS[0].value)
  const [data, setData] = useState(dayjs().format('YYYY-MM-DD'))
  const [slots, setSlots] = useState([])
  const [horarioSelecionado, setHorarioSelecionado] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [petSelecionado, setPetSelecionado] = useState('')

  useEffect(() => {
    if (!isAuthenticated) {
      setPets([])
      setPetSelecionado('')
      return
    }

    const carregarPets = async () => {
      try {
        const { data } = await api.get('/pets')
        setPets(data)
        if (data[0]) {
          setPetSelecionado(data[0].id)
        }
      } catch (error) {
        console.error('Erro ao carregar pets para agendamento rápido', error)
      }
    }

    carregarPets()
  }, [isAuthenticated])

  const podeBuscarHorarios = useMemo(() => Boolean(servico && data), [servico, data])

  useEffect(() => {
    const carregarHorarios = async () => {
      if (!podeBuscarHorarios) return
      setLoading(true)
      try {
        const params = new URLSearchParams({ date: data, serviceType: servico })
        const { data: slotsData } = await api.get(`/appointments/availability?${params.toString()}`)
        setSlots(slotsData)
      } catch (error) {
        console.warn('Não foi possível carregar horários disponíveis', error)
        setSlots([])
      } finally {
        setLoading(false)
        setHorarioSelecionado('')
      }
    }

    carregarHorarios()
  }, [podeBuscarHorarios, data, servico])

  const handleSubmit = async event => {
    event.preventDefault()
    setFeedback('')

    if (!horarioSelecionado) {
      setFeedback('Escolha um horário disponível para continuar.')
      return
    }

    if (!isAuthenticated) {
      onRequireAuth?.({
        tipoServico: servico,
        data,
        horario: horarioSelecionado
      })
      setFeedback('Faça login ou cadastre-se para concluir o agendamento.')
      return
    }

    if (!petSelecionado) {
      setFeedback('Cadastre um pet para finalizar seu agendamento.')
      return
    }

    setSaving(true)
    try {
      await api.post('/appointments', {
        animalId: petSelecionado,
        tipoServico: servico,
        dataHora: horarioSelecionado
      })
      setFeedback('Agendamento confirmado! Você receberá a confirmação por e-mail.')
    } catch (error) {
      setFeedback(error.response?.data?.message || 'Não foi possível concluir o agendamento agora.')
    } finally {
      setSaving(false)
    }
  }

  const horarios = slots.map(slot => ({
    inicio: slot.inicio,
    fim: slot.fim,
    label: `${dayjs(slot.inicio).format('DD/MM')} • ${dayjs(slot.inicio).format('HH:mm')} - ${dayjs(slot.fim).format('HH:mm')}`
  }))

  return (
    <section className="relative overflow-hidden rounded-[40px] border border-accent-500/20 bg-surface-100/80 px-6 py-8 shadow-card sm:px-10">
      <div className="absolute -left-20 -top-20 h-52 w-52 rounded-full bg-accent-500/20 blur-3xl" aria-hidden="true" />
      <div className="absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" aria-hidden="true" />

      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-xl space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-widest text-white">
            <SparklesIcon className="h-4 w-4" /> agendamento rápido
          </span>
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">Reserve o cuidado ideal em poucos cliques</h2>
          <p className="text-sm text-neutral-200 sm:text-base">
            Escolha o serviço, verifique os horários disponíveis e confirme sua visita em instantes. Os profissionais da nossa equipe serão notificados automaticamente.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="relative z-10 w-full max-w-md space-y-5 rounded-3xl border border-white/10 bg-surface-200/60 p-6 shadow-elevated backdrop-blur">
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-neutral-300">
              <CalendarDaysIcon className="h-4 w-4" /> Serviço
            </label>
            <div className="mt-2 grid gap-3">
              {SERVICOS.map(item => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setServico(item.value)}
                  className={`rounded-2xl border px-4 py-3 text-left transition ${
                    servico === item.value
                      ? 'border-accent-400 bg-accent-500/20 text-white shadow-elevated'
                      : 'border-white/10 bg-transparent text-neutral-200 hover:border-accent-400/60 hover:text-white'
                  }`}
                >
                  <strong className="block text-sm font-semibold">{item.label}</strong>
                  <span className="mt-1 block text-xs text-neutral-300">{item.descricao}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-wide text-neutral-300">
              <span>Data</span>
              <Input type="date" value={data} min={dayjs().format('YYYY-MM-DD')} onChange={event => setData(event.target.value)} />
            </label>
            {isAuthenticated && (
              <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-wide text-neutral-300">
                <span>Pet</span>
                <select
                  value={petSelecionado}
                  onChange={event => setPetSelecionado(event.target.value)}
                  className="rounded-2xl border border-white/10 bg-surface-100/80 px-4 py-3 text-sm text-neutral-100 shadow-card focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/40"
                >
                  <option value="">Selecione</option>
                  {pets.map(pet => (
                    <option key={pet.id} value={pet.id}>{pet.nome}</option>
                  ))}
                </select>
              </label>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-neutral-300">
              <ClockIcon className="h-4 w-4" /> Horários disponíveis
            </label>
            <div className="mt-3 flex flex-wrap gap-2">
              {loading && <p className="text-xs text-neutral-300">Carregando horários...</p>}
              {!loading && horarios.length === 0 && (
                <p className="text-xs text-neutral-300">Escolha outra data para visualizar novos horários.</p>
              )}
              {horarios.map(slot => (
                <button
                  key={slot.inicio}
                  type="button"
                  onClick={() => setHorarioSelecionado(slot.inicio)}
                  className={`rounded-full border px-3 py-2 text-xs transition ${
                    horarioSelecionado === slot.inicio
                      ? 'border-accent-400 bg-accent-500 text-white shadow-elevated'
                      : 'border-white/10 text-neutral-200 hover:border-accent-400/60 hover:text-white'
                  }`}
                >
                  {slot.label}
                </button>
              ))}
            </div>
          </div>

          {feedback && <p className="text-xs text-neutral-200">{feedback}</p>}

          <Button type="submit" className="w-full" disabled={saving || loading || horarios.length === 0}>
            {saving ? 'Enviando...' : 'Confirmar horário'}
          </Button>
        </form>
      </div>
    </section>
  )
}
