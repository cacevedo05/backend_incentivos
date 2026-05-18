import express from 'express'
import cors from 'cors'
import { errorMiddleware } from '@incentivos/shared'
import ordersRoutes from './modules/orders/orders.routes'

const app = express()
app.use(cors())
app.use(express.json())
app.use('/api/orders', ordersRoutes)
app.get('/health', (_req, res) => res.json({ ok: true, service: 'orders' }))
app.use(errorMiddleware)
export default app
