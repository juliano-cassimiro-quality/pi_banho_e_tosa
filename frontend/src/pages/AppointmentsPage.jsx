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
  const isCliente = user?.role === 'cliente'
  const [agendamentos, setAgendamentos] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const fetchAgendamentos = async () => {
    if (!isCliente) return
    setLoading(true)
    try {
      const { data } = await api.get(`/agendamentos/clientes/${user.id_cliente}`)
      setAgendamentos(
        data.map(item => ({
          ...item,
          data: dayjs(item.data_horario).format('DD/MM/YYYY HH:mm'),
          servico: item.nome_servico,
          profissional: item.profissional,
          animal: item.animal,
          status: item.status
        }))
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isCliente && user?.id_cliente) {
      fetchAgendamentos()
    }
  }, [user, isCliente])

  const handleCancel = async agendamento => {
    const motivo = window.prompt('Informe o motivo do cancelamento:')
    if (!motivo) return
    try {
      await api.post(`/agendamentos/${agendamento.id_agendamento}/cancelar`, { motivo })
      setMessage('Agendamento cancelado com sucesso.')
      fetchAgendamentos()
    } catch (err) {
      setMessage(err.response?.data?.error || 'Não foi possível cancelar o agendamento.')
    }
  }

  const handleReschedule = async agendamento => {
    const novoHorario = window.prompt('Informe o novo horário (YYYY-MM-DDTHH:mm):', dayjs(agendamento.data_horario).toISOString().slice(0, 16))
    if (!novoHorario) return
    try {
      await api.post(`/agendamentos/${agendamento.id_agendamento}/reagendar`, { novoHorario })
      setMessage('Agendamento reagendado com sucesso.')
      fetchAgendamentos()
    } catch (err) {
      setMessage(err.response?.data?.error || 'Não foi possível reagendar.')
    }
  }

  if (!isCliente) {
    return (
      <div>
        <PageHeader
          title="Agendamentos"
          description="Visualização de agendamentos está disponível somente para contas de clientes neste protótipo."
        />
        <Card>
          <p className="text-sm text-slate-500">
            Utilize uma conta de cliente para acompanhar, reagendar ou cancelar atendimentos.
          </p>
        </Card>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="Meus agendamentos"
        description="Acompanhe o status dos agendamentos, reagende ou cancele quando necessário."
      />
      <Card>
        {message && <p className="mb-4 text-sm text-slate-500">{message}</p>}
        <Table
          columns={columns}
          data={agendamentos.map(item => ({
            ...item,
            acoes: (
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="secondary"
                  onClick={() => handleReschedule(item)}
                  disabled={item.status === 'cancelado' || item.status === 'concluido'}
                >
                  Reagendar
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleCancel(item)}
                  disabled={item.status !== 'confirmado' && item.status !== 'pendente'}
                >
                  Cancelar
                </Button>
              </div>
            )
          }))}
          emptyMessage={loading ? 'Carregando agendamentos...' : 'Nenhum agendamento encontrado.'}
        />
      </Card>
    </div>
  )
}
