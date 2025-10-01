import React, { useEffect, useMemo, useRef, useState } from 'react'
import dayjs from 'dayjs'
import { CalendarDaysIcon, ClockIcon, SparklesIcon } from '@heroicons/react/24/outline'
import api from '../services/api'

const FALLBACK_SERVICES = [
  {
    id: 'banho-premium',
    nome: 'Banho relaxante',
    descricao: 'Ozonioterapia, hidratação e perfume hipoalergênico',
    tempoEstimado: 50
  },
  {
    id: 'tosa-personalizada',
    nome: 'Tosa personalizada',
    descricao: 'Tesoura artística e acabamento sob medida',
    tempoEstimado: 70
  },
  {
    id: 'spa-day',
    nome: 'Day care & spa',
    descricao: 'Recreação monitorada e banho premium completo',
    tempoEstimado: 180
  }
]

const FALLBACK_PROFESSIONALS = [
  { id: 'ana-lima', nome: 'Ana Lima' },
  { id: 'joao-souza', nome: 'João Souza' },
  { id: 'carla-ramos', nome: 'Carla Ramos' }
]

const FALLBACK_SLOTS = ['09:00', '10:30', '12:00', '13:30', '15:00', '16:30']

function createFallbackSlot (date, time) {
  return dayjs(`${date} ${time}`, 'YYYY-MM-DD HH:mm').toISOString()
}

function groupSlotsByPeriod (slots) {
  const periods = { morning: [], afternoon: [], evening: [] }
  slots.forEach(slot => {
    const hour = dayjs(slot.start).hour()
    if (hour < 12) {
      periods.morning.push(slot)
    } else if (hour < 18) {
      periods.afternoon.push(slot)
    } else {
      periods.evening.push(slot)
    }
  })
  return periods
}

export default function LandingScheduleWidget ({ isAuthenticated, user, onRequireAuth, onShowChat }) {
  const [servicos, setServicos] = useState([])
  const [profissionais, setProfissionais] = useState([])
  const servicosRef = useRef([])
  const profissionaisRef = useRef([])
  const [pets, setPets] = useState([])
  const [selectedServico, setSelectedServico] = useState('')
  const [selectedProfissional, setSelectedProfissional] = useState('')
  const [selectedPet, setSelectedPet] = useState('')
  const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'))
  const [slots, setSlots] = useState([])
  const [selectedSlot, setSelectedSlot] = useState('')
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [usingFallback, setUsingFallback] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const loadBasics = async () => {
      try {
        const previousServicos = servicosRef.current
        const previousProfissionais = profissionaisRef.current
        const [{ data: servicosData }, { data: profissionaisData }] = await Promise.all([
          api.get('/servicos'),
          api.get('/profissionais')
        ])
        setServicos(servicosData)
        setProfissionais(profissionaisData)
        servicosRef.current = servicosData
        profissionaisRef.current = profissionaisData
        setSelectedServico(current => {
          if (current) {
            const previous = previousServicos.find(
              servico => servico.id_servico?.toString() === current?.toString() || servico.id === current
            )
            const matched = servicosData.find(servico => {
              const idServico = servico.id_servico?.toString()
              return (
                idServico === current?.toString() ||
                servico.nome_servico === previous?.nome_servico ||
                servico.nome_servico === previous?.nome
              )
            })
            if (matched?.id_servico) {
              return matched.id_servico
            }
          }
          return servicosData[0]?.id_servico || ''
        })
        setSelectedProfissional(current => {
          if (current) {
            const previous = previousProfissionais.find(
              profissional => profissional.id_profissional?.toString() === current?.toString() || profissional.id === current
            )
            const matched = profissionaisData.find(profissional => {
              const idProf = profissional.id_profissional?.toString()
              return idProf === current?.toString() || profissional.nome === previous?.nome
            })
            if (matched?.id_profissional) {
              return matched.id_profissional
            }
          }
          return profissionaisData[0]?.id_profissional || ''
        })
        setUsingFallback(false)
      } catch (error) {
        console.warn('Usando dados simulados para serviços/profissionais', error?.response?.status)
        setServicos(FALLBACK_SERVICES)
        setProfissionais(FALLBACK_PROFESSIONALS)
        servicosRef.current = FALLBACK_SERVICES
        profissionaisRef.current = FALLBACK_PROFESSIONALS
        setSelectedServico(FALLBACK_SERVICES[0]?.id || '')
        setSelectedProfissional(FALLBACK_PROFESSIONALS[0]?.id || '')
        setUsingFallback(true)
      }
    }

    loadBasics()
  }, [isAuthenticated])

  useEffect(() => {
    if (!isAuthenticated || !user?.id_cliente) {
      setPets([])
      setSelectedPet('')
      return
    }

    const loadPets = async () => {
      try {
        const { data } = await api.get(`/animais/cliente/${user.id_cliente}`)
        setPets(data)
        setSelectedPet(prev => {
          if (prev) return prev
          return data[0]?.id_animal || ''
        })
      } catch (error) {
        console.error('Erro ao carregar pets', error)
      }
    }

    loadPets()
  }, [isAuthenticated, user?.id_cliente])

  const canFetchSlots = useMemo(
    () => selectedServico && selectedProfissional && date,
    [selectedServico, selectedProfissional, date]
  )

  useEffect(() => {
    const loadSlots = async () => {
      if (!canFetchSlots) return
      setLoadingSlots(true)
      setFeedback('')
      try {
        const params = new URLSearchParams({
          idProfissional: selectedProfissional,
          data: date,
          idServico: selectedServico
        })
        const { data: slotsData } = await api.get(`/agendamentos/disponiveis?${params.toString()}`)
        const normalized = slotsData.map(slot => ({
          start: slot.start,
          end: slot.end
        }))
        setSlots(normalized)
        setUsingFallback(false)
      } catch (error) {
        console.warn('Usando horários simulados', error?.response?.status)
        const fallbackSlots = FALLBACK_SLOTS.map(time => ({
          start: createFallbackSlot(date, time)
        }))
        setSlots(fallbackSlots)
        setUsingFallback(true)
      } finally {
        setLoadingSlots(false)
        setSelectedSlot('')
      }
    }

    loadSlots()
  }, [canFetchSlots, selectedProfissional, selectedServico, date])
  const periods = useMemo(() => groupSlotsByPeriod(slots), [slots])

  const handleSubmit = async event => {
    event.preventDefault()
    setFeedback('')

    if (!selectedSlot) {
      setFeedback('Escolha um horário disponível para continuar.')
      return
    }

    const schedulePayload = {
      idServico: selectedServico,
      idProfissional: selectedProfissional,
      data,
      horario: selectedSlot,
      nomeServico:
        servicos.find(servico => servico.id_servico === selectedServico || servico.id === selectedServico)?.nome_servico ||
        servicos.find(servico => servico.id_servico === selectedServico || servico.id === selectedServico)?.nome,
      nomeProfissional:
        profissionais.find(profissional =>
          profissional.id_profissional === selectedProfissional || profissional.id === selectedProfissional
        )?.nome
    }

    if (!isAuthenticated) {
      setFeedback('Faça login para finalizar seu agendamento. Vamos salvar as suas escolhas.')
      onRequireAuth?.(schedulePayload)
      return
    }

    if (!selectedPet) {
      setFeedback('Cadastre um pet para finalizar o agendamento em sua conta.')
      return
    }

    try {
      setSaving(true)
      await api.post('/agendamentos', {
        idCliente: user.id_cliente,
        idAnimal: selectedPet,
        idServico: selectedServico,
        idProfissional: selectedProfissional,
        dataHorario: selectedSlot
      })
      setFeedback('Agendamento criado com sucesso! Você pode acompanhar todos na sua agenda.')
      setSelectedSlot('')
    } catch (error) {
      const message =
        error.response?.data?.error || 'Não foi possível criar o agendamento agora. Tente novamente em instantes.'
      setFeedback(message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="grid gap-8 rounded-[2.5rem] border border-slate-200 bg-white/80 p-8 shadow-xl backdrop-blur">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-500">Agendamento rápido</p>
          <h2 className="text-2xl font-bold text-slate-900">Escolha o melhor horário direto da landing</h2>
          <p className="mt-2 text-sm text-slate-600">
            Selecione serviço, profissional e confirme o horário em poucos cliques. Tudo integrado à sua agenda.
          </p>
        </div>
        {onShowChat && (
          <button
            type="button"
            onClick={onShowChat}
            className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-4 py-2 text-sm font-semibold text-brand-600 transition hover:bg-brand-50"
          >
            Falar com a Luma
            <SparklesIcon className="h-4 w-4" />
          </button>
        )}
      </header>
      <form className="grid gap-6 md:grid-cols-[1.2fr,1fr]" onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-slate-700">Serviço</span>
              <select
                value={selectedServico}
                onChange={event => setSelectedServico(event.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
              >
                <option value="">Selecione um serviço</option>
                {servicos.map(servico => (
                  <option key={servico.id_servico || servico.id} value={servico.id_servico || servico.id}>
                    {servico.nome_servico || servico.nome}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-slate-700">Profissional</span>
              <select
                value={selectedProfissional}
                onChange={event => setSelectedProfissional(event.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
              >
                <option value="">Selecione um profissional</option>
                {profissionais.map(profissional => (
                  <option key={profissional.id_profissional || profissional.id} value={profissional.id_profissional || profissional.id}>
                    {profissional.nome}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-slate-700">Data</span>
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm">
                <CalendarDaysIcon className="h-5 w-5 text-brand-500" />
                <input
                  type="date"
                  value={date}
                  min={dayjs().format('YYYY-MM-DD')}
                  onChange={event => setDate(event.target.value)}
                  className="flex-1 border-none bg-transparent focus:outline-none"
                />
              </div>
            </label>
            {isAuthenticated && (
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-slate-700">Pet</span>
                <select
                  value={selectedPet}
                  onChange={event => setSelectedPet(event.target.value)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
                >
                  <option value="">Selecione um pet</option>
                  {pets.map(pet => (
                    <option key={pet.id_animal} value={pet.id_animal}>
                      {pet.nome}
                    </option>
                  ))}
                </select>
              </label>
            )}
          </div>
          <div>
            <span className="text-sm font-semibold text-slate-700">Horários disponíveis</span>
            <div className="mt-3 space-y-4">
              {loadingSlots && <p className="text-sm text-slate-500">Carregando horários...</p>}
              {!loadingSlots && slots.length === 0 && (
                <p className="text-sm text-slate-500">Nenhum horário disponível para os filtros selecionados.</p>
              )}
              {!loadingSlots && slots.length > 0 && (
                <div className="grid gap-4 lg:grid-cols-3">
                  {['morning', 'afternoon', 'evening'].map(periodKey => {
                    const periodSlots = periods[periodKey] || []
                    if (periodSlots.length === 0) return null
                    const periodLabel =
                      periodKey === 'morning' ? 'Manhã' : periodKey === 'afternoon' ? 'Tarde' : 'Noite'
                    return (
                      <div key={periodKey} className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
                        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                          <ClockIcon className="h-4 w-4 text-brand-500" />
                          {periodLabel}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {periodSlots.map(slot => (
                            <button
                              key={slot.start}
                              type="button"
                              onClick={() => setSelectedSlot(slot.start)}
                              className={`rounded-full px-3 py-2 text-sm font-medium transition ${
                                selectedSlot === slot.start
                                  ? 'bg-primary-600 text-white shadow-lg'
                                  : 'border border-slate-200 bg-white text-slate-600 hover:border-primary-200 hover:text-primary-700'
                              }`}
                            >
                              {dayjs(slot.start).format('HH:mm')}
                            </button>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
              {usingFallback && (
                <p className="text-xs text-slate-400">
                  Exibindo horários demonstrativos para navegação rápida. Faça login para consultar a disponibilidade real.
                </p>
              )}
            </div>
          </div>
        </div>
        <aside className="flex flex-col justify-between rounded-3xl bg-gradient-to-br from-brand-500 via-brand-500 to-primary-600 p-6 text-white shadow-xl">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Resumo do atendimento</h3>
            <ul className="space-y-3 text-sm text-brand-50/90">
              <li>
                Serviço:{' '}
                <strong>
                  {servicos.find(servico => servico.id_servico === selectedServico || servico.id === selectedServico)?.nome_servico ||
                    servicos.find(servico => servico.id_servico === selectedServico || servico.id === selectedServico)?.nome ||
                    'Selecione um serviço'}
                </strong>
              </li>
              <li>
                Profissional:{' '}
                <strong>
                  {profissionais.find(profissional =>
                    profissional.id_profissional === selectedProfissional || profissional.id === selectedProfissional
                  )?.nome || 'Selecione um profissional'}
                </strong>
              </li>
              <li>
                Data:{' '}
                <strong>{dayjs(date).format('DD/MM/YYYY')}</strong>
              </li>
              <li>
                Horário:{' '}
                <strong>{selectedSlot ? dayjs(selectedSlot).format('HH:mm') : 'Selecione um horário'}</strong>
              </li>
              {isAuthenticated && (
                <li>
                  Pet:{' '}
                  <strong>
                    {pets.find(pet => pet.id_animal === Number(selectedPet) || pet.id_animal === selectedPet)?.nome ||
                      (pets.length === 0 ? 'Cadastre um pet na área logada' : 'Selecione um pet')}
                  </strong>
                </li>
              )}
            </ul>
          </div>
          <div className="space-y-3">
            {feedback && <p className="rounded-2xl bg-white/15 px-4 py-3 text-sm text-white/90">{feedback}</p>}
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-brand-600 shadow-lg transition hover:bg-brand-100 disabled:cursor-not-allowed disabled:opacity-70"
              disabled={saving || loadingSlots || !selectedServico || !selectedProfissional}
            >
              {saving ? 'Agendando...' : isAuthenticated ? 'Confirmar agendamento' : 'Entrar para finalizar'}
            </button>
            {!isAuthenticated && (
              <p className="text-center text-xs text-white/70">
                Crie sua conta ou faça login para finalizar. Suas escolhas ficam salvas automaticamente.
              </p>
            )}
          </div>
        </aside>
      </form>
    </section>
  )
}
