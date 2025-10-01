import { Router } from 'express'
import {
  listar,
  criar,
  salvarDisponibilidade,
  salvarIndisponibilidade,
  listarDisponibilidade,
  listarIndisponibilidade
} from '../controllers/profissionaisController.js'
import { authenticate } from '../middlewares/authMiddleware.js'

const router = Router()

router.get('/', listar)
router.post('/', authenticate(['profissional']), criar)
router.post('/disponibilidades', authenticate(['profissional']), salvarDisponibilidade)
router.post('/indisponibilidades', authenticate(['profissional']), salvarIndisponibilidade)
router.get('/:idProfissional/disponibilidades', listarDisponibilidade)
router.get('/:idProfissional/indisponibilidades', listarIndisponibilidade)

export default router
