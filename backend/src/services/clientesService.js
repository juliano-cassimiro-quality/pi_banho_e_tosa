import dayjs from 'dayjs'
import { query } from '../config/database.js'
import { hashPassword } from '../utils/password.js'
import { obterRolePorNome } from './rolesService.js'

export async function listarClientes () {
  const { rows } = await query(
    `SELECT c.id_cliente, c.nome, c.telefone, c.email, c.data_cadastro, r.nome AS role
       FROM clientes c
       INNER JOIN roles r ON r.id_role = c.id_role
      ORDER BY c.data_cadastro DESC`
  )
  return rows
}

export async function obterClientePorEmail (email) {
  const { rows } = await query(
    `SELECT c.*, r.nome AS role
       FROM clientes c
       INNER JOIN roles r ON r.id_role = c.id_role
      WHERE c.email = $1`,
    [email]
  )
  return rows[0]
}

export async function criarCliente ({ nome, telefone, email, senha }) {
  const existente = await obterClientePorEmail(email)
  if (existente) {
    const error = new Error('E-mail já cadastrado')
    error.status = 400
    throw error
  }

  const role = await obterRolePorNome('cliente')
  if (!role) {
    const error = new Error('Role de cliente não configurada')
    error.status = 500
    throw error
  }

  const senhaHash = await hashPassword(senha)
  const { rows } = await query(
    `INSERT INTO clientes (nome, telefone, email, senha_hash, data_cadastro, id_role)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id_cliente, nome, telefone, email, data_cadastro, id_role`,
    [nome, telefone, email, senhaHash, dayjs().toISOString(), role.id_role]
  )

  const novoCliente = rows[0]
  return { ...novoCliente, role: role.nome }
}
