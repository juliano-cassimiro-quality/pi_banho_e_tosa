import 'express-async-errors'
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import router from './routes/index.js'
import { errorHandler } from './middlewares/errorHandler.js'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ status: 'API Banho e Tosa operante' })
})

app.use('/api', router)

app.use(errorHandler)

export default app
