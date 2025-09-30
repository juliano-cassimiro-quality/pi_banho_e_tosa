import {
  listarProfissionais,
  definirDisponibilidade,
  registrarIndisponibilidade,
  listarDisponibilidades,
  listarIndisponibilidades
} from '../services/profissionaisService.js'

export async function listar (req, res) {
  const profissionais = await listarProfissionais()
  res.json(profissionais)
}

export async function salvarDisponibilidade (req, res) {
  const { idProfissional, diaSemana, horaInicio, horaFim } = req.body
  if (!idProfissional || diaSemana === undefined || !horaInicio || !horaFim) {
    return res.status(400).json({ error: 'Campos obrigatórios não preenchidos' })
  }

  const disponibilidade = await definirDisponibilidade({ idProfissional, diaSemana, horaInicio, horaFim })
  res.status(201).json(disponibilidade)
}

export async function salvarIndisponibilidade (req, res) {
  const { idProfissional, dataInicio, dataFim, motivo } = req.body
  if (!idProfissional || !dataInicio || !dataFim) {
    return res.status(400).json({ error: 'Campos obrigatórios não preenchidos' })
  }

  const indisponibilidade = await registrarIndisponibilidade({ idProfissional, dataInicio, dataFim, motivo })
  res.status(201).json(indisponibilidade)
}

export async function listarDisponibilidade (req, res) {
  const { idProfissional } = req.params
  const disponibilidades = await listarDisponibilidades(idProfissional)
  res.json(disponibilidades)
}

export async function listarIndisponibilidade (req, res) {
  const { idProfissional } = req.params
  const indisponibilidades = await listarIndisponibilidades(idProfissional)
  res.json(indisponibilidades)
}
