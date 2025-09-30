import { query } from '../config/database.js'

export async function listarServicos () {
  const { rows } = await query('SELECT * FROM servicos ORDER BY nome_servico')
  return rows
}

export async function criarServico ({ nomeServico, descricao, valor, tempoEstimado }) {
  const tempo = Number(tempoEstimado) || 60
  const { rows } = await query(
    `INSERT INTO servicos (nome_servico, descricao, valor, tempo_estimado)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [nomeServico, descricao, valor, tempo]
  )
  return rows[0]
}

export async function atualizarServico (idServico, { nomeServico, descricao, valor, tempoEstimado }) {
  const tempo = Number(tempoEstimado) || 60
  const { rows } = await query(
    `UPDATE servicos
        SET nome_servico = $1,
            descricao = $2,
            valor = $3,
            tempo_estimado = $4
      WHERE id_servico = $5
    RETURNING *`,
    [nomeServico, descricao, valor, tempo, idServico]
  )
  return rows[0]
}

export async function removerServico (idServico) {
  await query('DELETE FROM servicos WHERE id_servico = $1', [idServico])
}

export async function obterServico (idServico) {
  const { rows } = await query('SELECT * FROM servicos WHERE id_servico = $1', [idServico])
  return rows[0]
}
