import express from 'express'
import cors from 'cors'
import { errorMiddleware } from '@incentivos/shared'
import workLogRoutes from './modules/work-logs/work-logs.routes'

const app = express()
app.use(cors())
app.use(express.json())
app.use('/api/work-logs', workLogRoutes)
app.get('/health', (_req, res) => res.json({ ok: true, service: 'work-logs' }))
app.use(errorMiddleware)
export default app
