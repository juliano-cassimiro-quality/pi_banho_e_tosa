import React from 'react'
import PageHeader from '../components/PageHeader'

export default function DashboardPage () {
  return (
    <div className="space-y-4 text-center">
      <PageHeader
        title="Painel em construção"
        description="Em breve você poderá acompanhar métricas detalhadas do atendimento diretamente por aqui."
      />
      <p className="text-sm text-neutral-400">
        Utilize o menu principal para acessar a agenda ou cadastrar novos pets enquanto finalizamos esta área.
      </p>
    </div>
  )
}
