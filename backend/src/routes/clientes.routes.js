import { Router } from 'express'
import { criar, listar } from '../controllers/clientesController.js'

const router = Router()

router.get('/', listar)
router.post('/', criar)

export default router
