import { Router } from 'express'
import { listar, criar, atualizar, remover } from '../controllers/servicosController.js'
import { authenticate } from '../middlewares/authMiddleware.js'

const router = Router()

router.get('/', listar)
router.post('/', authenticate(['profissional']), criar)
router.put('/:idServico', authenticate(['profissional']), atualizar)
router.delete('/:idServico', authenticate(['profissional']), remover)

export default router
