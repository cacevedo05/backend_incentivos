import express from 'express'
import cors from 'cors'
import { errorMiddleware } from '@incentivos/shared'
import referencesRoutes from './modules/references/reference.routes'

const app = express()
app.use(cors())
app.use(express.json())
app.use('/api/references', referencesRoutes)
app.get('/health', (_req, res) => res.json({ ok: true, service: 'references' }))
app.use(errorMiddleware)
export default app
