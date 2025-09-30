import { query } from '../config/database.js'

export async function cadastrarAnimal ({ idCliente, nome, especie, porte, idade, observacoes }) {
  const { rows } = await query(
    `INSERT INTO animais (id_cliente, nome, especie, porte, idade, observacoes)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [idCliente, nome, especie, porte, idade, observacoes]
  )
  return rows[0]
}

export async function listarAnimaisPorCliente (idCliente) {
  const { rows } = await query(
    `SELECT * FROM animais WHERE id_cliente = $1 ORDER BY nome`,
    [idCliente]
  )
  return rows
}

export async function obterAnimal (idAnimal) {
  const { rows } = await query('SELECT * FROM animais WHERE id_animal = $1', [idAnimal])
  return rows[0]
}
