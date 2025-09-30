import {
  obterSlotsDisponiveis,
  criarAgendamento,
  listarAgendamentosCliente,
  listarAgendamentosProfissional,
  cancelarAgendamento,
  reagendar,
  registrarObservacoes,
  listarHistorico,
  registrarPresenca
} from '../services/agendamentosService.js'

export async function slotsDisponiveis (req, res) {
  const { idProfissional, data, idServico } = req.query
  if (!idProfissional || !data) {
    return res.status(400).json({ error: 'Profissional e data são obrigatórios' })
  }

  const slots = await obterSlotsDisponiveis({ idProfissional, data, idServico })
  res.json(slots)
}

export async function criar (req, res) {
  const { idCliente, idAnimal, idServico, idProfissional, dataHorario, status, observacoes } = req.body
  const agendamento = await criarAgendamento({
    idCliente,
    idAnimal,
    idServico,
    idProfissional,
    dataHorario,
    status,
    observacoes
  })
  res.status(201).json(agendamento)
}

export async function listarCliente (req, res) {
  const { idCliente } = req.params
  const agendamentos = await listarAgendamentosCliente(idCliente)
  res.json(agendamentos)
}

export async function listarProfissional (req, res) {
  const { idProfissional } = req.params
  const { periodo, referencia } = req.query
  const agendamentos = await listarAgendamentosProfissional({ idProfissional, periodo, referencia })
  res.json(agendamentos)
}

export async function cancelar (req, res) {
  const { idAgendamento } = req.params
  const { motivo } = req.body
  if (!motivo) {
    return res.status(400).json({ error: 'Informe o motivo do cancelamento' })
  }

  const resultado = await cancelarAgendamento({ idAgendamento, motivo })
  res.json(resultado)
}

export async function reagendarController (req, res) {
  const { idAgendamento } = req.params
  const { novoHorario } = req.body
  if (!novoHorario) {
    return res.status(400).json({ error: 'Informe o novo horário' })
  }

  const agendamento = await reagendar({ idAgendamento, novoHorario })
  res.json(agendamento)
}

export async function registrarObs (req, res) {
  const { idAgendamento } = req.params
  const { idProfissional, observacoes } = req.body
  if (!idProfissional || !observacoes) {
    return res.status(400).json({ error: 'Profissional e observações são obrigatórios' })
  }

  const resultado = await registrarObservacoes({ idAgendamento, idProfissional, observacoes })
  res.json(resultado)
}

export async function historico (req, res) {
  const { idCliente, idAnimal } = req.query
  const historico = await listarHistorico({ idCliente, idAnimal })
  res.json(historico)
}

export async function confirmarPresenca (req, res) {
  const { idAgendamento } = req.params
  const { confirmado } = req.body
  const resultado = await registrarPresenca({ idAgendamento, confirmado })
  res.json(resultado)
}
