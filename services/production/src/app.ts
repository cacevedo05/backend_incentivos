import express from 'express'
import cors from 'cors'
import { errorMiddleware } from '@incentivos/shared'
import productionRoutes from './modules/production/production.routes'

const app = express()
app.use(cors())
app.use(express.json())
app.use('/api/production', productionRoutes)
app.get('/health', (_req, res) => res.json({ ok: true, service: 'production' }))
app.use(errorMiddleware)
export default app
