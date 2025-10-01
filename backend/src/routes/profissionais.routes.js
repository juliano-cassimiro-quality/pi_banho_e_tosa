import { Router } from 'express'
import {
  listar,
  criar,
  salvarDisponibilidade,
  salvarIndisponibilidade,
  listarDisponibilidade,
  listarIndisponibilidade
} from '../controllers/profissionaisController.js'

const router = Router()

router.get('/', listar)
router.post('/', criar)
router.post('/disponibilidades', salvarDisponibilidade)
router.post('/indisponibilidades', salvarIndisponibilidade)
router.get('/:idProfissional/disponibilidades', listarDisponibilidade)
router.get('/:idProfissional/indisponibilidades', listarIndisponibilidade)

export default router
