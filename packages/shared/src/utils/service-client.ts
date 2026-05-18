type ServiceConfig = {
  host: string
  port: number
}

const DEFAULTS: Record<string, ServiceConfig> = {
  auth: { host: 'localhost', port: 3001 },
  employees: { host: 'localhost', port: 3002 },
  references: { host: 'localhost', port: 3003 },
  orders: { host: 'localhost', port: 3004 },
  production: { host: 'localhost', port: 3005 },
  'work-logs': { host: 'localhost', port: 3006 },
  liquidation: { host: 'localhost', port: 3007 },
}

function resolveConfig(name: string): ServiceConfig {
  const envKey = `SERVICE_${name.toUpperCase().replace(/-/g, '_')}_HOST`
  const envPort = `SERVICE_${name.toUpperCase().replace(/-/g, '_')}_PORT`
  const host = process.env[envKey] || DEFAULTS[name]?.host
  const port = Number(process.env[envPort]) || DEFAULTS[name]?.port
  if (!host || !port) throw new Error(`Unknown service: ${name}`)
  return { host, port }
}

export function createServiceClient(serviceName: string) {
  const cfg = resolveConfig(serviceName)
  const baseUrl = `http://${cfg.host}:${cfg.port}`

  return {
    async get<T = any>(path: string, init?: RequestInit): Promise<T> {
      const res = await fetch(`${baseUrl}${path}`, {
        ...init,
        method: 'GET',
        headers: { 'Content-Type': 'application/json', ...init?.headers },
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.message || `HTTP ${res.status} from ${serviceName}`)
      }
      return res.json()
    },
  }
}
