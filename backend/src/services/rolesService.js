import { query } from '../config/database.js'

export async function obterRolePorNome (nome) {
  const { rows } = await query('SELECT id_role, nome FROM roles WHERE nome = $1', [nome])
  return rows[0]
}

export async function listarRoles () {
  const { rows } = await query('SELECT id_role, nome FROM roles ORDER BY nome')
  return rows
}
