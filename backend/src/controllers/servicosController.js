import {
  listarServicos,
  criarServico,
  atualizarServico,
  removerServico
} from '../services/servicosService.js'

export async function listar (req, res) {
  const servicos = await listarServicos()
  res.json(servicos)
}

export async function criar (req, res) {
  const { nomeServico, descricao, valor, tempoEstimado } = req.body
  if (!nomeServico) {
    return res.status(400).json({ error: 'Nome do serviço é obrigatório' })
  }

  const servico = await criarServico({ nomeServico, descricao, valor, tempoEstimado })
  res.status(201).json(servico)
}

export async function atualizar (req, res) {
  const { idServico } = req.params
  const { nomeServico, descricao, valor, tempoEstimado } = req.body
  const servico = await atualizarServico(idServico, { nomeServico, descricao, valor, tempoEstimado })
  res.json(servico)
}

export async function remover (req, res) {
  const { idServico } = req.params
  await removerServico(idServico)
  res.status(204).send()
}
