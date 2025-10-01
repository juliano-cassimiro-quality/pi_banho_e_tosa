import { query } from '../config/database.js'
import { hashPassword } from '../utils/password.js'
import { obterRolePorNome } from './rolesService.js'

export async function listarProfissionais () {
  const { rows } = await query(
    `SELECT p.id_profissional, p.nome, p.telefone, p.email, p.ativo, r.nome AS role
       FROM profissionais p
       INNER JOIN roles r ON r.id_role = p.id_role
      WHERE p.ativo = TRUE
      ORDER BY p.nome`
  )
  return rows
}

export async function obterProfissional (id) {
  const { rows } = await query('SELECT * FROM profissionais WHERE id_profissional = $1', [id])
  return rows[0]
}

export async function obterProfissionalPorEmail (email) {
  const { rows } = await query(
    `SELECT p.*, r.nome AS role
       FROM profissionais p
       INNER JOIN roles r ON r.id_role = p.id_role
      WHERE p.email = $1`,
    [email]
  )
  return rows[0]
}

export async function criarProfissional ({ nome, telefone, email, senha }) {
  const existente = await obterProfissionalPorEmail(email)
  if (existente) {
    const error = new Error('E-mail já cadastrado para profissional')
    error.status = 400
    throw error
  }

  const role = await obterRolePorNome('profissional')
  if (!role) {
    const error = new Error('Role de profissional não configurada')
    error.status = 500
    throw error
  }

  const senhaHash = await hashPassword(senha)
  const { rows } = await query(
    `INSERT INTO profissionais (nome, telefone, email, senha_hash, id_role)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id_profissional, nome, telefone, email, ativo, id_role`,
    [nome, telefone, email, senhaHash, role.id_role]
  )

  const profissional = rows[0]
  return { ...profissional, role: role.nome }
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
