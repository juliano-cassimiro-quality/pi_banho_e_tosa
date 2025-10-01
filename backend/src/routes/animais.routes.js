import { Router } from 'express'
import { criar, listarPorCliente } from '../controllers/animaisController.js'

const router = Router()

router.post('/', criar)
router.get('/cliente/:idCliente', listarPorCliente)

export default router
