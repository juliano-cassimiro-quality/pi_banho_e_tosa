import React, { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Card from '../components/Card'
import Button from '../components/Button'
import Input from '../components/Input'
import PageHeader from '../components/PageHeader'
import useAuth from '../hooks/useAuth'
import api from '../services/api'
import dayjs from 'dayjs'

export default function SchedulePage () {
  const { user } = useAuth()
  const location = useLocation()
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
  const [appliedPrefill, setAppliedPrefill] = useState(null)

  const prefill = location.state?.prefill

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
    if (user?.id_cliente) {
      fetchInitialData()
    }
  }, [user])

  useEffect(() => {
    if (!prefill) return
    if (!servicos.length || !profissionais.length) return
    if (appliedPrefill === prefill) return

    setForm(prev => {
      const next = { ...prev }
      if (prefill.data) {
        next.data = prefill.data
      }
      if (prefill.horario) {
        next.horario = prefill.horario
      }

      if (prefill.idServico || prefill.nomeServico) {
        const matchedServico = servicos.find(servico => {
          const idServico = servico.id_servico?.toString()
          return (
            idServico === prefill.idServico?.toString() ||
            servico.nome_servico === prefill.nomeServico ||
            servico.nome === prefill.nomeServico
          )
        })
        if (matchedServico?.id_servico) {
          next.idServico = matchedServico.id_servico
        }
      }

      if (prefill.idProfissional || prefill.nomeProfissional) {
        const matchedProfissional = profissionais.find(profissional => {
          const idProf = profissional.id_profissional?.toString()
          return idProf === prefill.idProfissional?.toString() || profissional.nome === prefill.nomeProfissional
        })
        if (matchedProfissional?.id_profissional) {
          next.idProfissional = matchedProfissional.id_profissional
        }
      }

      return next
    })

    setAppliedPrefill(prefill)
  }, [prefill, servicos, profissionais, appliedPrefill])

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

  return (
    <div>
      <PageHeader
        title="Agendar serviço"
        description="Escolha o pet, serviço, profissional e horário disponível para confirmar o atendimento."
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
                <option key={pet.id_animal} value={pet.id_animal}>
                  {pet.nome}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-wide text-neutral-400">
            <span>Serviço</span>
            <select
              name="idServico"
              value={form.idServico}
              onChange={handleChange}
              className="rounded-2xl border border-neutral-600/40 bg-surface-100/70 px-4 py-3 text-sm text-neutral-100 shadow-card focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/40"
            >
              <option value="">Selecione</option>
              {servicos.map(servico => (
                <option key={servico.id_servico} value={servico.id_servico}>
                  {servico.nome_servico}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-wide text-neutral-400">
            <span>Profissional</span>
            <select
              name="idProfissional"
              value={form.idProfissional}
              onChange={handleChange}
              className="rounded-2xl border border-neutral-600/40 bg-surface-100/70 px-4 py-3 text-sm text-neutral-100 shadow-card focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/40"
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
            <span className="block text-xs font-semibold uppercase tracking-wide text-neutral-400">Horário disponível</span>
            <div className="mt-3 flex flex-wrap gap-2">
              {loadingSlots && <p className="text-sm text-neutral-400">Carregando horários...</p>}
              {!loadingSlots && slots.length === 0 && (
                <p className="text-sm text-neutral-400">Nenhum horário disponível para os filtros selecionados.</p>
              )}
              {slots.map(slot => (
                <button
                  key={slot.start}
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, horario: slot.start }))}
                  className={`rounded-full border px-3 py-2 text-sm transition ${
                    form.horario === slot.start
                      ? 'border-accent-400 bg-accent-500 text-white shadow-elevated'
                      : 'border-neutral-600/40 bg-transparent text-neutral-300 hover:border-accent-400 hover:text-white'
                  }`}
                >
                  {dayjs(slot.start).format('DD/MM/YYYY HH:mm')}
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
