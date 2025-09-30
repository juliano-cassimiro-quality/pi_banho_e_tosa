import { Router } from 'express'
import { login, solicitarRecuperacao, redefinir } from '../controllers/authController.js'

const router = Router()

router.post('/login', login)
router.post('/recovery', solicitarRecuperacao)
router.post('/reset', redefinir)

export default router
