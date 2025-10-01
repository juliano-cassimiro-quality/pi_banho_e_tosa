import { Router } from 'express'
import { listar, criar, atualizar, remover } from '../controllers/servicosController.js'

const router = Router()

router.get('/', listar)
router.post('/', criar)
router.put('/:idServico', atualizar)
router.delete('/:idServico', remover)

export default router
