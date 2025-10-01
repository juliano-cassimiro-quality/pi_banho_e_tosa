import React, { useEffect, useState } from 'react'
import PageHeader from '../components/PageHeader'
import StatsCard from '../components/StatsCard'
import Card from '../components/Card'
import Table from '../components/Table'
import api from '../services/api'
import useAuth from '../hooks/useAuth'

const columns = [
  { Header: 'Data', accessor: 'data' },
  { Header: 'Serviço', accessor: 'servico' },
  { Header: 'Profissional', accessor: 'profissional' },
  { Header: 'Status', accessor: 'status' }
]

export default function DashboardPage () {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [recent, setRecent] = useState([])
  const [error, setError] = useState('')
  const isAdmin = user?.role === 'admin'

  useEffect(() => {
    const fetchData = async () => {
      setError('')
      try {
        const { data } = await api.get('/admin/dashboard')
        setStats(data)
        setRecent([])
      } catch (err) {
        console.error('Erro ao carregar dados do dashboard', err)
        setError('Não foi possível carregar os indicadores agora. Tente novamente mais tarde.')
      }
    }
    if (isAdmin) {
      fetchData()
    }
  }, [isAdmin])

  if (!isAdmin) {
    return (
      <div className="space-y-4 text-center">
        <PageHeader title="Acesso restrito" description="Somente administradores podem visualizar este painel." />
        <p className="text-sm text-slate-500">
          Utilize a landing page ou o fluxo de agendamento rápido para acompanhar seus atendimentos.
        </p>
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="Painel administrativo" description="Acompanhe os principais indicadores do espaço." />
      {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
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
      <Card className="mt-8" title="Últimos agendamentos">
        <Table
          columns={columns}
          data={recent}
          emptyMessage="Conecte seu ERP ou cadastre agendamentos para visualizar aqui."
        />
      </Card>
    </div>
  )
}
