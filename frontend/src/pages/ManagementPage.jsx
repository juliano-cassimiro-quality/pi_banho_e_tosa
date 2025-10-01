import React, { useEffect, useMemo, useState } from 'react'
import Card from '../components/Card'
import PageHeader from '../components/PageHeader'
import Button from '../components/Button'
import Table from '../components/Table'
import Input from '../components/Input'
import useAuth from '../hooks/useAuth'
import api from '../services/api'
import dayjs from 'dayjs'

const columns = [
  { Header: 'Horário', accessor: 'horario' },
  { Header: 'Cliente', accessor: 'cliente' },
  { Header: 'Pet', accessor: 'animal' },
  { Header: 'Serviço', accessor: 'servico' },
  { Header: 'Status', accessor: 'status' },
  { Header: 'Ações', accessor: 'acoes' }
]

export default function ManagementPage () {
  const { user } = useAuth()
  const [data, setData] = useState(dayjs().format('YYYY-MM-DD'))
  const [agendamentos, setAgendamentos] = useState([])
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState('')

  const isProfissional = user?.role === 'profissional'

  const formattedAppointments = useMemo(() => {
    return agendamentos.map(item => ({
      ...item,
      horario: dayjs(item.dataHora).format('HH:mm'),
      cliente: item.cliente?.nome,
      animal: item.animal?.nome,
      servico: item.tipoServico.replace(/_/g, ' '),
      status: item.status.toLowerCase()
    }))
  }, [agendamentos])

  useEffect(() => {
    if (!isProfissional) return

    const fetchAppointments = async () => {
      setLoading(true)
      setFeedback('')
      try {
        const params = new URLSearchParams({ date: data })
        const { data: response } = await api.get(`/appointments/today?${params.toString()}`)
        setAgendamentos(response)
      } catch (error) {
        console.error('Erro ao carregar agenda diária', error)
        setFeedback('Não foi possível carregar os agendamentos do dia.')
      } finally {
        setLoading(false)
      }
    }

    fetchAppointments()
  }, [data, isProfissional])

  const handleComplete = async agendamento => {
    const observacoes = window.prompt('Deseja registrar alguma observação do atendimento?', agendamento.observacoesProfissional || '')
    try {
      await api.post(`/appointments/${agendamento.id}/complete`, { observacoesProfissional: observacoes || undefined })
      setFeedback('Atendimento marcado como concluído.')
      setAgendamentos(prev => prev.map(item => (item.id === agendamento.id ? { ...item, status: 'CONCLUIDO', observacoesProfissional: observacoes } : item)))
    } catch (error) {
      setFeedback(error.response?.data?.message || 'Não foi possível concluir o atendimento.')
    }
  }

  if (!isProfissional) {
    return (
      <div className="rounded-[32px] border border-neutral-600/40 bg-surface-200/80 p-8 text-center text-neutral-100 shadow-card">
        <h2 className="text-xl font-semibold text-white">Acesso restrito</h2>
        <p className="mt-2 text-sm text-neutral-400">
          Apenas profissionais podem visualizar e atualizar a agenda operacional.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Agenda do profissional"
        description="Visualize os atendimentos agendados e registre observações ao concluir cada serviço."
      />

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-wide text-neutral-400">
            <span>Data</span>
            <Input type="date" value={data} onChange={event => setData(event.target.value)} />
          </label>
          {feedback && <p className="text-sm text-neutral-300">{feedback}</p>}
        </div>
        <div className="mt-6">
          <Table
            columns={columns}
            data={formattedAppointments.map(item => ({
              ...item,
              acoes: (
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => handleComplete(item)}
                    disabled={item.status === 'concluido'}
                  >
                    Concluir atendimento
                  </Button>
                </div>
              )
            }))}
            emptyMessage={loading ? 'Carregando agendamentos...' : 'Nenhum atendimento marcado para esta data.'}
          />
        </div>
      </Card>
    </div>
  )
}
