import { query } from '../config/database.js'

function parseTotal (rows) {
  return Number(rows?.total) || 0
}

export async function obterDashboard () {
  const [clientes, animais, servicos, agendamentos, cancelamentos, faltas] = await Promise.all([
    query('SELECT COUNT(*)::int as total FROM clientes').then(r => r.rows[0]),
    query('SELECT COUNT(*)::int as total FROM animais').then(r => r.rows[0]),
    query('SELECT COUNT(*)::int as total FROM servicos').then(r => r.rows[0]),
    query('SELECT COUNT(*)::int as total FROM agendamentos').then(r => r.rows[0]),
    query('SELECT COUNT(*)::int as total FROM cancelamentos').then(r => r.rows[0]),
    query("SELECT COUNT(*)::int as total FROM agendamentos WHERE status = 'ausente'").then(r => r.rows[0])
  ])

  return {
    totalClientes: parseTotal(clientes),
    totalAnimais: parseTotal(animais),
    totalServicos: parseTotal(servicos),
    totalAgendamentos: parseTotal(agendamentos),
    totalCancelamentos: parseTotal(cancelamentos),
    totalFaltas: parseTotal(faltas)
  }
}
