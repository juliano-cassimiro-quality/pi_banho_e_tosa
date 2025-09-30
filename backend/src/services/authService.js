import jwt from 'jsonwebtoken'
import { comparePassword, hashPassword } from '../utils/password.js'
import { obterClientePorEmail } from './clientesService.js'
import { query } from '../config/database.js'

function generateToken (payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d'
  })
}

export async function autenticarCliente ({ email, senha }) {
  const cliente = await obterClientePorEmail(email)
  if (!cliente) {
    const error = new Error('Credenciais inválidas')
    error.status = 401
    throw error
  }

  const senhaValida = await comparePassword(senha, cliente.senha_hash)
  if (!senhaValida) {
    const error = new Error('Credenciais inválidas')
    error.status = 401
    throw error
  }

  const token = generateToken({
    sub: cliente.id_cliente,
    role: 'cliente',
    email: cliente.email,
    nome: cliente.nome
  })

  return {
    token,
    cliente: {
      id_cliente: cliente.id_cliente,
      nome: cliente.nome,
      email: cliente.email
    }
  }
}

export async function recuperarSenha ({ email }) {
  const cliente = await obterClientePorEmail(email)
  if (!cliente) {
    const error = new Error('E-mail não encontrado')
    error.status = 404
    throw error
  }

  const token = generateToken({ sub: cliente.id_cliente, role: 'cliente', action: 'password_recovery' })

  await query(
    `INSERT INTO tokens_recuperacao (id_cliente, token, expiracao)
     VALUES ($1, $2, NOW() + INTERVAL '1 hour')
     ON CONFLICT (token) DO UPDATE SET expiracao = EXCLUDED.expiracao`,
    [cliente.id_cliente, token]
  )

  return { token }
}

export async function redefinirSenha ({ token, novaSenha }) {
  const { rows } = await query(
    `SELECT tr.*, c.email FROM tokens_recuperacao tr
      INNER JOIN clientes c ON c.id_cliente = tr.id_cliente
     WHERE token = $1 AND expiracao > NOW()`,
    [token]
  )

  const registro = rows[0]
  if (!registro) {
    const error = new Error('Token inválido ou expirado')
    error.status = 400
    throw error
  }

  const hash = await hashPassword(novaSenha)

  await query('UPDATE clientes SET senha_hash = $1 WHERE id_cliente = $2', [hash, registro.id_cliente])
  await query('DELETE FROM tokens_recuperacao WHERE id_token = $1', [registro.id_token])

  return { success: true }
}
