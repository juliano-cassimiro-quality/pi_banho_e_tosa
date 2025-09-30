import { Router } from 'express'
import { dashboard } from '../controllers/adminController.js'

const router = Router()

router.get('/dashboard', dashboard)

export default router
