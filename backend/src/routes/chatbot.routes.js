import { Router } from 'express'
import { enviarMensagem } from '../controllers/chatbotController.js'

const router = Router()

router.post('/', enviarMensagem)

export default router
