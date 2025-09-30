import dayjs from 'dayjs'
import { query } from '../config/database.js'
import { hashPassword } from '../utils/password.js'

export async function listarClientes () {
  const { rows } = await query('SELECT id_cliente, nome, telefone, email, data_cadastro FROM clientes ORDER BY data_cadastro DESC')
  return rows
}

export async function obterClientePorEmail (email) {
  const { rows } = await query('SELECT * FROM clientes WHERE email = $1', [email])
  return rows[0]
}

export async function criarCliente ({ nome, telefone, email, senha }) {
  const existente = await obterClientePorEmail(email)
  if (existente) {
    const error = new Error('E-mail já cadastrado')
    error.status = 400
    throw error
  }

  const senhaHash = await hashPassword(senha)
  const { rows } = await query(
    `INSERT INTO clientes (nome, telefone, email, senha_hash, data_cadastro)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id_cliente, nome, telefone, email, data_cadastro`,
    [nome, telefone, email, senhaHash, dayjs().toISOString()]
  )

  return rows[0]
}
