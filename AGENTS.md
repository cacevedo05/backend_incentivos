# backend_incentivos — agent guide

## Stack
Node.js + Express 5 + TypeScript 6 + PostgreSQL (pg Pool) + JWT + Zod + Swagger.

## Architecture
**Microservices + API Gateway.** Each domain is an independent service under `services/`. A shared package lives in `packages/shared/`. The gateway at `gateway/` routes external requests to the correct service.

### Service ports
| Service | Port | Path prefix |
|---------|------|-------------|
| Gateway | 3000 | — |
| Auth | 3001 | `/api/auth`, `/api/users` |
| Employees | 3002 | `/api/employees` |
| References | 3003 | `/api/references` |
| Orders | 3004 | `/api/orders` |
| Production | 3005 | `/api/production` |
| Work-logs | 3006 | `/api/work-logs` |
| Liquidation | 3007 | `/api/liquidation` |

## Commands
| Command | Action |
|---------|--------|
| `npm run dev:all` | Start all services + gateway concurrently |
| `npm run dev:auth` | Start single service |
| `npm run dev:gateway` | Start gateway only |
| `npm run build` | Compile all workspaces |
| `npm start` | Run production gateway (`gateway/dist/server.js`) |
| `docker compose up -d` | Start all 11 Docker containers |
| `docker compose down -v` | Stop and wipe volumes (fresh DB) |
| `docker compose build --no-cache {service}` | Rebuild single service image |
| `docker compose logs -f {service}` | Tail logs for a service |

## Project structure
```
packages/shared/          — @incentivos/shared (db, middlewares, validations, config)
services/
  {name}/                 — auth, employees, references, orders, production, work-logs, liquidation
    src/
      server.ts           — entrypoint (port 3xxx)
      app.ts              — Express setup + route mounting
      modules/{domain}/   — routes, controller, service, repository, model, dto, schema
gateway/                  — API Gateway (port 3000, proxies to services)
src/                      — legacy monolith (preserved for reference)
```

## Conventions
- **No semicolons** (Express 5 style)
- Each service follows: `routes → controller → service → repository → DB`
- Validation: Zod schemas + `validate()` middleware (body/params/query)
- `roleMiddleware(...roles)` — ADMIN always passes; others must match one listed
- Error responses: `{ message: string }` (with optional `errors`/`fields`)
- Success responses: bare object/array
- Shared code in `packages/shared/src/index.ts`, imported as `@incentivos/shared`

## Inter-service communication
- Services call each other via HTTP using `createServiceClient('service-name')` from the shared package
- The gateway applies `authMiddleware` to all proxied routes **except** `/api/auth/login`
- Each service also handles its own auth/role middleware on individual routes

## Database
- Pool auto-connects on import (`packages/shared/src/db/postgres.ts`)
- Use `withTransaction()` for multi-step writes
- `work_logs` unique constraint: `(employee_id, work_date)`, CHECK: `minutes_downtime <= minutes_worked`

## Auth
- `Authorization: Bearer <token>` required
- Token payload includes `role` field
- Roles: `ADMIN` (full access), `PRODUCCION` (production/orders/liquidation), `RH` (employees)

## Swagger
- Available at `http://localhost:3000/api-docs`
- Spec generated from JSDoc in `*.routes.ts` files

## Environment
- `.env` at workspace root (gitignored). Required vars: `PORT`, `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`
- Redis vars optional (`REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`)

## Docker
- All services share a single Dockerfile (`Dockerfile` in workspace root) using `node:20-alpine`
- Docker Compose lives at `C:\Users\cacevedo\Desktop\ProyectoTrabajodeGrado\RICARDO\docker-compose.yml` (11 services)
- Services use `node:20-alpine` image's default ENTRYPOINT (`docker-entrypoint.sh`) and override CMD per service in compose
- `npm ci --ignore-scripts` for installs; bcrypt replaced with bcryptjs (pure JS) to avoid native compilation
- The build step runs `npm run build` for all workspaces (including `packages/shared` which has `build: tsc` now)
- `rm -rf src init-db` removes TypeScript source after build; runtime uses compiled JS from `dist/`
- Postgres data persisted in `pgdata` volume; PG18 uses `/var/lib/postgresql` mount path
- Init scripts in `init-db/` run alphabetically: `01-create-roles.sql`, `02-schema.sql`, `03-seed.sql`
- Seed creates admin user: admin@test.com / admin123

## Known quirks
- `import emplyeesRoutes from './modules/employees/employees.routes'` — typo in legacy `src/app.ts` line 7 (kept as-is)
- `query('SELECT 1')` on pool connect is a side effect in postgres.ts — alternate entrypoints must handle this
- **Login bypasses gateway auth** — the gateway skips `authMiddleware` for `/api/auth/login` only
- Gateway uses `pathRewrite: (_path, req) => req.originalUrl` to restore Express-stripped prefix when proxying
- Gateway body forwarding: `express.json()` consumes the body stream, so `proxyReq` handler re-stringifies and writes it
- Service registry (`gateway/src/services/registry.ts`) reads `SERVICE_{NAME}_HOST`/`_PORT` env vars for Docker hostnames
- `packages/shared` uses `main: dist/index.js` (runtime) and `types: src/index.ts` (build-time type checking)
