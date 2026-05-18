type ServiceTarget = {
  url: string
  prefix: string
}

function resolveUrl(name: string, defaultPort: number): string {
  const envKey = `SERVICE_${name.toUpperCase().replace(/-/g, '_')}_HOST`
  const envPort = `SERVICE_${name.toUpperCase().replace(/-/g, '_')}_PORT`
  const host = process.env[envKey] || 'localhost'
  const port = process.env[envPort] || String(defaultPort)
  return `http://${host}:${port}`
}

export const serviceRegistry: ServiceTarget[] = [
  { prefix: '/api/auth', url: resolveUrl('auth', 3001) },
  { prefix: '/api/users', url: resolveUrl('auth', 3001) },
  { prefix: '/api/employees', url: resolveUrl('employees', 3002) },
  { prefix: '/api/references', url: resolveUrl('references', 3003) },
  { prefix: '/api/orders', url: resolveUrl('orders', 3004) },
  { prefix: '/api/production', url: resolveUrl('production', 3005) },
  { prefix: '/api/work-logs', url: resolveUrl('work-logs', 3006) },
  { prefix: '/api/liquidation', url: resolveUrl('liquidation', 3007) },
]
