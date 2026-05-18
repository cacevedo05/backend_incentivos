import express from 'express'
import cors from 'cors'
import { errorMiddleware } from '@incentivos/shared'
import liquidationRoutes from './modules/liquidation/liquidation.routes'

const app = express()
app.use(cors())
app.use(express.json())
app.use('/api/liquidation', liquidationRoutes)
app.get('/health', (_req, res) => res.json({ ok: true, service: 'liquidation' }))
app.use(errorMiddleware)
export default app
