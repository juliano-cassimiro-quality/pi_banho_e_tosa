import dayjs from 'dayjs'
import { query } from '../config/database.js'
import { generateTimeSlots, filterUnavailableSlots } from '../utils/availability.js'
import { obterServico } from './servicosService.js'
import { obterAnimal } from './animaisService.js'
import { obterProfissional } from './profissionaisService.js'
import { NotificationType, sendNotification } from '../utils/notifications.js'

export const AGENDAMENTO_STATUS = Object.freeze({
  PENDENTE: 'pendente',
  CONFIRMADO: 'confirmado',
  CANCELADO: 'cancelado',
  CONCLUIDO: 'concluido',
  AUSENTE: 'ausente'
})

function calcularFim (inicio, duracaoMinutos) {
  const duration = Number(duracaoMinutos) || 60
  return dayjs(inicio).add(duration, 'minute')
}

function intervaloSobreposto ({ inicioA, fimA, inicioB, fimB }) {
  return dayjs(inicioA).isBefore(fimB) && dayjs(fimA).isAfter(inicioB)
}

async function buscarAgendamento (idAgendamento) {
  const { rows } = await query('SELECT * FROM agendamentos WHERE id_agendamento = $1', [idAgendamento])
  return rows[0]
}

async function validarDisponibilidade ({ idProfissional, inicioISO, fimISO, ignorarAgendamentoId }) {
  const { rows } = await query(
    `SELECT a.id_agendamento, a.data_horario, COALESCE(s.tempo_estimado, 60) as tempo_estimado
       FROM agendamentos a
  LEFT JOIN servicos s ON s.id_servico = a.id_servico
      WHERE a.id_profissional = $1
        AND a.status NOT IN ('cancelado', 'ausente')
        AND DATE(a.data_horario) = DATE($2)`,
    [idProfissional, inicioISO]
  )

  const existeConflito = rows.some(row => {
    if (ignorarAgendamentoId && row.id_agendamento === ignorarAgendamentoId) {
      return false
    }
    const inicioExistente = dayjs(row.data_horario)
    const fimExistente = calcularFim(inicioExistente, row.tempo_estimado)
    return intervaloSobreposto({ inicioA: inicioExistente, fimA: fimExistente, inicioB: dayjs(inicioISO), fimB: dayjs(fimISO) })
  })

  if (existeConflito) {
    const error = new Error('Horário indisponível para o profissional selecionado')
    error.status = 400
    throw error
  }
}

export async function listarAgendamentosCliente (idCliente) {
  const { rows } = await query(
    `SELECT a.*, s.nome_servico, p.nome as profissional, an.nome as animal
       FROM agendamentos a
 INNER JOIN servicos s ON s.id_servico = a.id_servico
 INNER JOIN profissionais p ON p.id_profissional = a.id_profissional
 INNER JOIN animais an ON an.id_animal = a.id_animal
      WHERE a.id_cliente = $1
      ORDER BY a.data_horario DESC`,
    [idCliente]
  )
  return rows
}

export async function listarAgendamentosProfissional ({ idProfissional, periodo = 'dia', referencia }) {
  const base = dayjs(referencia || new Date())
  let inicio
  let fim

  switch (periodo) {
    case 'semana':
      inicio = base.startOf('week')
      fim = base.endOf('week')
      break
    case 'mes':
      inicio = base.startOf('month')
      fim = base.endOf('month')
      break
    default:
      inicio = base.startOf('day')
      fim = base.endOf('day')
  }

  const { rows } = await query(
    `SELECT a.*, c.nome as cliente, an.nome as animal, s.nome_servico
       FROM agendamentos a
 INNER JOIN clientes c ON c.id_cliente = a.id_cliente
 INNER JOIN animais an ON an.id_animal = a.id_animal
 INNER JOIN servicos s ON s.id_servico = a.id_servico
      WHERE a.id_profissional = $1
        AND a.data_horario BETWEEN $2 AND $3
      ORDER BY a.data_horario ASC`,
    [idProfissional, inicio.toISOString(), fim.toISOString()]
  )
  return rows
}

export async function obterSlotsDisponiveis ({ idProfissional, data, idServico }) {
  const profissional = await obterProfissional(idProfissional)
  if (!profissional) {
    const error = new Error('Profissional não encontrado')
    error.status = 404
    throw error
  }

  const servico = idServico ? await obterServico(idServico) : null
  const duracao = Number(servico?.tempo_estimado) || 60

  const dia = dayjs(data)
  const diaSemana = dia.day()

  const { rows: disponibilidades } = await query(
    `SELECT * FROM disponibilidades_profissionais
      WHERE id_profissional = $1 AND dia_semana = $2`,
    [idProfissional, diaSemana]
  )

  if (disponibilidades.length === 0) {
    return []
  }

  const { rows: indisponibilidades } = await query(
    `SELECT data_inicio, data_fim
       FROM indisponibilidades_profissionais
      WHERE id_profissional = $1
        AND daterange(date(data_inicio), date(data_fim), '[]') @> $2::date`,
    [idProfissional, dia.format('YYYY-MM-DD')]
  )

  const { rows: agendamentos } = await query(
    `SELECT a.data_horario, COALESCE(s.tempo_estimado, 60) as tempo_estimado
       FROM agendamentos a
  LEFT JOIN servicos s ON s.id_servico = a.id_servico
      WHERE a.id_profissional = $1
        AND DATE(a.data_horario) = $2
        AND a.status NOT IN ('cancelado', 'ausente')`,
    [idProfissional, dia.format('YYYY-MM-DD')]
  )

  const takenIntervals = [
    ...agendamentos.map(item => ({
      start: dayjs(item.data_horario).toISOString(),
      end: calcularFim(item.data_horario, item.tempo_estimado).toISOString()
    })),
    ...indisponibilidades.map(item => ({
      start: dayjs(item.data_inicio).toISOString(),
      end: dayjs(item.data_fim).toISOString()
    }))
  ]

  const slots = disponibilidades.flatMap(item => {
    const inicio = dayjs(`${dia.format('YYYY-MM-DD')}T${item.hora_inicio}`)
    const fim = dayjs(`${dia.format('YYYY-MM-DD')}T${item.hora_fim}`)
    return generateTimeSlots({ start: inicio, end: fim, durationMinutes: duracao })
  })

  return filterUnavailableSlots(slots, takenIntervals)
}

export async function criarAgendamento ({ idCliente, idAnimal, idServico, idProfissional, dataHorario, status = AGENDAMENTO_STATUS.PENDENTE, observacoes }) {
  const animal = await obterAnimal(idAnimal)
  if (!animal || animal.id_cliente !== idCliente) {
    const error = new Error('Animal não pertence ao cliente informado')
    error.status = 400
    throw error
  }

  const servico = await obterServico(idServico)
  if (!servico) {
    const error = new Error('Serviço não encontrado')
    error.status = 404
    throw error
  }

  const inicio = dayjs(dataHorario)
  const fim = calcularFim(inicio, servico.tempo_estimado)

  await validarDisponibilidade({
    idProfissional,
    inicioISO: inicio.toISOString(),
    fimISO: fim.toISOString()
  })

  const { rows } = await query(
    `INSERT INTO agendamentos (id_cliente, id_animal, id_servico, id_profissional, data_horario, status, observacoes, criado_em, atualizado_em)
     VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
     RETURNING *`,
    [idCliente, idAnimal, idServico, idProfissional, inicio.toISOString(), status, observacoes]
  )

  sendNotification({
    type: NotificationType.CONFIRMATION,
    recipient: `cliente:${idCliente}`,
    message: `Agendamento criado para ${inicio.format('DD/MM/YYYY HH:mm')}`
  })

  return rows[0]
}

export async function atualizarStatus ({ idAgendamento, status, observacoes }) {
  const agendamento = await buscarAgendamento(idAgendamento)
  if (!agendamento) {
    const error = new Error('Agendamento não encontrado')
    error.status = 404
    throw error
  }

  const { rows } = await query(
    `UPDATE agendamentos SET status = $1, observacoes = COALESCE($2, observacoes), atualizado_em = NOW()
      WHERE id_agendamento = $3
      RETURNING *`,
    [status, observacoes, idAgendamento]
  )

  return rows[0]
}

export async function cancelarAgendamento ({ idAgendamento, motivo }) {
  const agendamento = await buscarAgendamento(idAgendamento)
  if (!agendamento) {
    const error = new Error('Agendamento não encontrado')
    error.status = 404
    throw error
  }

  const diferencaHoras = dayjs(agendamento.data_horario).diff(dayjs(), 'hour', true)
  if (diferencaHoras < 2) {
    const error = new Error('Cancelamento permitido apenas com 2h de antecedência')
    error.status = 400
    throw error
  }

  await query('BEGIN')
  try {
    await query(
      `UPDATE agendamentos SET status = $1, atualizado_em = NOW()
        WHERE id_agendamento = $2`,
      [AGENDAMENTO_STATUS.CANCELADO, idAgendamento]
    )

    await query(
      `INSERT INTO cancelamentos (id_agendamento, motivo, data_cancelamento)
       VALUES ($1, $2, NOW())`,
      [idAgendamento, motivo]
    )

    await query('COMMIT')
  } catch (error) {
    await query('ROLLBACK')
    throw error
  }

  sendNotification({
    type: NotificationType.CANCELLATION,
    recipient: `cliente:${agendamento.id_cliente}`,
    message: `Agendamento ${idAgendamento} cancelado. Motivo: ${motivo}`
  })

  return { success: true }
}

export async function reagendar ({ idAgendamento, novoHorario }) {
  const agendamento = await buscarAgendamento(idAgendamento)
  if (!agendamento) {
    const error = new Error('Agendamento não encontrado')
    error.status = 404
    throw error
  }

  const servico = await obterServico(agendamento.id_servico)
  const inicio = dayjs(novoHorario)
  const fim = calcularFim(inicio, servico.tempo_estimado)

  await validarDisponibilidade({
    idProfissional: agendamento.id_profissional,
    inicioISO: inicio.toISOString(),
    fimISO: fim.toISOString(),
    ignorarAgendamentoId: idAgendamento
  })

  const { rows } = await query(
    `UPDATE agendamentos SET data_horario = $1, status = $2, atualizado_em = NOW()
      WHERE id_agendamento = $3
      RETURNING *`,
    [inicio.toISOString(), AGENDAMENTO_STATUS.CONFIRMADO, idAgendamento]
  )

  sendNotification({
    type: NotificationType.RESCHEDULE,
    recipient: `cliente:${agendamento.id_cliente}`,
    message: `Novo horário confirmado para ${inicio.format('DD/MM/YYYY HH:mm')}`
  })

  return rows[0]
}

export async function registrarObservacoes ({ idAgendamento, idProfissional, observacoes }) {
  const agendamento = await buscarAgendamento(idAgendamento)
  if (!agendamento) {
    const error = new Error('Agendamento não encontrado')
    error.status = 404
    throw error
  }

  if (agendamento.id_profissional !== idProfissional) {
    const error = new Error('Apenas o profissional responsável pode registrar observações')
    error.status = 403
    throw error
  }

  await query('BEGIN')
  try {
    await query(
      `UPDATE agendamentos SET observacoes = $1, status = $2, atualizado_em = NOW()
        WHERE id_agendamento = $3`,
      [observacoes, AGENDAMENTO_STATUS.CONCLUIDO, idAgendamento]
    )

    await query(
      `INSERT INTO historico_atendimentos (id_agendamento, id_profissional, data_conclusao, observacoes)
       VALUES ($1, $2, NOW(), $3)
       ON CONFLICT (id_agendamento) DO UPDATE SET observacoes = EXCLUDED.observacoes, data_conclusao = EXCLUDED.data_conclusao`,
      [idAgendamento, idProfissional, observacoes]
    )

    await query('COMMIT')
  } catch (error) {
    await query('ROLLBACK')
    throw error
  }

  return { success: true }
}

export async function listarHistorico ({ idCliente, idAnimal }) {
  const filtros = []
  const params = []

  if (idCliente) {
    filtros.push(`c.id_cliente = $${params.length + 1}`)
    params.push(idCliente)
  }

  if (idAnimal) {
    filtros.push(`a.id_animal = $${params.length + 1}`)
    params.push(idAnimal)
  }

  const whereClause = filtros.length ? `WHERE ${filtros.join(' AND ')}` : ''

  const { rows } = await query(
    `SELECT ha.*, ag.data_horario, s.nome_servico, p.nome as profissional, c.nome as cliente, a.nome as animal
       FROM historico_atendimentos ha
 INNER JOIN agendamentos ag ON ag.id_agendamento = ha.id_agendamento
 INNER JOIN servicos s ON s.id_servico = ag.id_servico
 INNER JOIN profissionais p ON p.id_profissional = ha.id_profissional
 INNER JOIN clientes c ON c.id_cliente = ag.id_cliente
 INNER JOIN animais a ON a.id_animal = ag.id_animal
      ${whereClause}
      ORDER BY ha.data_conclusao DESC`,
    params
  )

  return rows
}

export async function registrarPresenca ({ idAgendamento, confirmado }) {
  const agendamento = await buscarAgendamento(idAgendamento)
  if (!agendamento) {
    const error = new Error('Agendamento não encontrado')
    error.status = 404
    throw error
  }

  const status = confirmado ? AGENDAMENTO_STATUS.CONFIRMADO : AGENDAMENTO_STATUS.CANCELADO

  const { rows } = await query(
    `UPDATE agendamentos SET status = $1, atualizado_em = NOW()
      WHERE id_agendamento = $2
      RETURNING *`,
    [status, idAgendamento]
  )

  return rows[0]
}
