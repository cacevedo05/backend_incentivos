import express from 'express'
import cors from 'cors'
import { createProxyMiddleware } from 'http-proxy-middleware'
import swaggerUi from 'swagger-ui-express'
import { authMiddleware, errorMiddleware } from '@incentivos/shared'
import { swaggerSpec } from './config/swagger'
import { serviceRegistry } from './services/registry'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  swaggerOptions: { persistAuthorization: true },
}))

app.get('/health', (_req, res) => {
  res.json({ ok: true, message: 'API Gateway funcionando' })
})

const publicPrefixes = ['/api/auth/login']

for (const svc of serviceRegistry) {
  const isPublic = publicPrefixes.some((p) => svc.prefix.startsWith(p) || p.startsWith(svc.prefix))

  app.use(
    svc.prefix,
    ...(isPublic ? [] : [authMiddleware]),
    createProxyMiddleware({
      target: svc.url,
      changeOrigin: true,
      pathRewrite: (_path, req) => req.originalUrl,
      on: {
        proxyReq: (proxyReq, req) => {
          if (req.body && typeof req.body === 'object' && Buffer.isBuffer(req.body) === false) {
            const bodyData = JSON.stringify(req.body)
            proxyReq.setHeader('Content-Type', 'application/json')
            proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData))
            proxyReq.write(bodyData)
            proxyReq.end()
          }
        },
      },
    })
  )
}

app.use(errorMiddleware)

export default app
