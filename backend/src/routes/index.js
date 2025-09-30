import { Router } from 'express'

import clientesRoutes from './clientes.routes.js'
import authRoutes from './auth.routes.js'
import animaisRoutes from './animais.routes.js'
import agendamentosRoutes from './agendamentos.routes.js'
import profissionaisRoutes from './profissionais.routes.js'
import servicosRoutes from './servicos.routes.js'
import adminRoutes from './admin.routes.js'

const router = Router()

router.use('/clientes', clientesRoutes)
router.use('/auth', authRoutes)
router.use('/animais', animaisRoutes)
router.use('/agendamentos', agendamentosRoutes)
router.use('/profissionais', profissionaisRoutes)
router.use('/servicos', servicosRoutes)
router.use('/admin', adminRoutes)

export default router
