import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import Card from '../components/Card'
import Button from '../components/Button'
import PageHeader from '../components/PageHeader'
import Table from '../components/Table'
import useAuth from '../hooks/useAuth'
import api from '../services/api'

const columns = [
  { Header: 'Data', accessor: 'data' },
  { Header: 'Pet', accessor: 'animal' },
  { Header: 'Serviço', accessor: 'servico' },
  { Header: 'Profissional', accessor: 'profissional' },
  { Header: 'Status', accessor: 'status' },
  { Header: 'Ações', accessor: 'acoes' }
]

export default function AppointmentsPage () {
  const { user } = useAuth()
  const [agendamentos, setAgendamentos] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const fetchAgendamentos = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/appointments')
      setAgendamentos(
        data.map(item => ({
          ...item,
          data: dayjs(item.dataHora).format('DD/MM/YYYY HH:mm'),
          servico: item.tipoServico.replace(/_/g, ' '),
          profissional: item.profissional?.nome,
          animal: item.animal?.nome,
          status: item.status
        }))
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchAgendamentos()
    }
  }, [user])

  const handleCancel = async agendamento => {
    const motivo = window.prompt('Informe o motivo do cancelamento:')
    if (!motivo) return
    try {
      await api.post(`/appointments/${agendamento.id}/cancel`, { motivo })
      setMessage('Agendamento cancelado com sucesso.')
      fetchAgendamentos()
    } catch (err) {
      setMessage(err.response?.data?.error || 'Não foi possível cancelar o agendamento.')
    }
  }

  const handleReschedule = async agendamento => {
    const novoHorario = window.prompt('Informe o novo horário (YYYY-MM-DDTHH:mm):', dayjs(agendamento.dataHora).toISOString().slice(0, 16))
    if (!novoHorario) return
    try {
      await api.post(`/appointments/${agendamento.id}/reschedule`, { novaDataHora: novoHorario })
      setMessage('Agendamento reagendado com sucesso.')
      fetchAgendamentos()
    } catch (err) {
      setMessage(err.response?.data?.error || 'Não foi possível reagendar.')
    }
  }

  return (
    <div>
      <PageHeader
        title="Meus agendamentos"
        description="Acompanhe o status dos agendamentos, reagende ou cancele quando necessário."
      />
      <Card>
        {message && <p className="mb-4 text-sm text-neutral-300">{message}</p>}
        <Table
          columns={columns}
          data={agendamentos.map(item => ({
            ...item,
            status: item.status.toLowerCase(),
            acoes: user?.role === 'cliente'
              ? (
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => handleReschedule(item)}
                      disabled={['cancelado', 'concluido'].includes(item.status.toLowerCase())}
                    >
                      Reagendar
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleCancel(item)}
                      disabled={!['agendado', 'confirmado'].includes(item.status.toLowerCase())}
                    >
                      Cancelar
                    </Button>
                  </div>
                )
              : null
          }))}
          emptyMessage={loading ? 'Carregando agendamentos...' : 'Nenhum agendamento encontrado.'}
        />
      </Card>
    </div>
  )
}
