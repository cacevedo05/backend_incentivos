import express from 'express'
import cors from 'cors'
import { errorMiddleware } from '@incentivos/shared'
import authRoutes from './modules/auth/auth.routes'
import userRoutes from './modules/users/users.routes'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'auth' })
})

app.use(errorMiddleware)

export default app
