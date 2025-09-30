import { Router } from 'express'
import {
  slotsDisponiveis,
  criar,
  listarCliente,
  listarProfissional,
  cancelar,
  reagendarController,
  registrarObs,
  historico,
  confirmarPresenca
} from '../controllers/agendamentosController.js'

const router = Router()

router.get('/disponiveis', slotsDisponiveis)
router.get('/clientes/:idCliente', listarCliente)
router.get('/profissionais/:idProfissional', listarProfissional)
router.get('/historico', historico)
router.post('/', criar)
router.post('/:idAgendamento/cancelar', cancelar)
router.post('/:idAgendamento/reagendar', reagendarController)
router.post('/:idAgendamento/observacoes', registrarObs)
router.post('/:idAgendamento/presenca', confirmarPresenca)

export default router
