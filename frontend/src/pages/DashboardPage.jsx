import React, { useEffect, useState } from 'react'
import PageHeader from '../components/PageHeader'
import StatsCard from '../components/StatsCard'
import Card from '../components/Card'
import Table from '../components/Table'
import api from '../services/api'
import dayjs from 'dayjs'
import useAuth from '../hooks/useAuth'

const columns = [
  { Header: 'Data', accessor: 'data' },
  { Header: 'Serviço', accessor: 'servico' },
  { Header: 'Profissional', accessor: 'profissional' },
  { Header: 'Status', accessor: 'status' }
]

export default function DashboardPage () {
  const { user } = useAuth()
  const isCliente = user?.role === 'cliente'
  const [stats, setStats] = useState(null)
  const [recent, setRecent] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const [statsRes, agendamentosRes] = await Promise.all([
        api.get('/admin/dashboard'),
        api.get(`/agendamentos/clientes/${user.id_cliente}`)
      ])
      setStats(statsRes.data)
      setRecent(
        agendamentosRes.data
          .slice(0, 5)
          .map(item => ({
            ...item,
            data: dayjs(item.data_horario).format('DD/MM/YYYY HH:mm'),
            servico: item.nome_servico,
            profissional: item.profissional,
            status: item.status
          }))
      )
    }
    if (isCliente && user?.id_cliente) {
      fetchData()
    }
  }, [user, isCliente])

  if (!isCliente) {
    return (
      <div>
        <PageHeader title="Painel" description="Estatísticas personalizadas disponíveis apenas para clientes." />
        <Card>
          <p className="text-sm text-slate-500">
            Faça login como cliente para visualizar indicadores e agendamentos recentes.
          </p>
        </Card>
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="Painel" description="Acompanhe os principais indicadores do sistema." />
      {stats && (
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          <StatsCard label="Clientes" value={stats.totalClientes} />
          <StatsCard label="Pets" value={stats.totalAnimais} color="green" />
          <StatsCard label="Serviços" value={stats.totalServicos} color="violet" />
          <StatsCard label="Agendamentos" value={stats.totalAgendamentos} color="orange" />
          <StatsCard label="Cancelamentos" value={stats.totalCancelamentos} color="red" />
          <StatsCard label="Faltas" value={stats.totalFaltas} color="red" />
        </div>
      )}
      <Card className="mt-8" title="Agendamentos recentes">
        <Table columns={columns} data={recent} emptyMessage="Nenhum agendamento encontrado." />
      </Card>
    </div>
  )
}
