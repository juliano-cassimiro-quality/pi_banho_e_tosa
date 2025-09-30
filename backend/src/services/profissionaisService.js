import { query } from '../config/database.js'

export async function listarProfissionais () {
  const { rows } = await query('SELECT id_profissional, nome, telefone, email, ativo FROM profissionais WHERE ativo = TRUE ORDER BY nome')
  return rows
}

export async function obterProfissional (id) {
  const { rows } = await query('SELECT * FROM profissionais WHERE id_profissional = $1', [id])
  return rows[0]
}

export async function definirDisponibilidade ({ idProfissional, diaSemana, horaInicio, horaFim }) {
  const { rows } = await query(
    `INSERT INTO disponibilidades_profissionais (id_profissional, dia_semana, hora_inicio, hora_fim)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (id_profissional, dia_semana, hora_inicio)
     DO UPDATE SET hora_fim = EXCLUDED.hora_fim
     RETURNING *`,
    [idProfissional, diaSemana, horaInicio, horaFim]
  )
  return rows[0]
}

export async function registrarIndisponibilidade ({ idProfissional, dataInicio, dataFim, motivo }) {
  const { rows } = await query(
    `INSERT INTO indisponibilidades_profissionais (id_profissional, data_inicio, data_fim, motivo)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [idProfissional, dataInicio, dataFim, motivo]
  )
  return rows[0]
}

export async function listarDisponibilidades (idProfissional) {
  const { rows } = await query(
    `SELECT * FROM disponibilidades_profissionais
      WHERE id_profissional = $1
      ORDER BY dia_semana, hora_inicio`,
    [idProfissional]
  )
  return rows
}

export async function listarIndisponibilidades (idProfissional) {
  const { rows } = await query(
    `SELECT * FROM indisponibilidades_profissionais
      WHERE id_profissional = $1
      ORDER BY data_inicio DESC`,
    [idProfissional]
  )
  return rows
}
