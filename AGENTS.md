# backend_incentivos — agent guide

## Stack
Node.js + Express 5 + TypeScript 6 + PostgreSQL (pg Pool) + JWT + Zod + Swagger.

## Architecture
**Microservices + API Gateway.** Each domain is an independent service under `services/`. A shared package lives in `packages/shared/`. The gateway at `gateway/` routes external requests to the correct service.

Infraestructura desplegada en **Azure** mediante **Terraform**. CI/CD via **Jenkins** (corriendo local con `java -jar` como usuario, no como servicio SYSTEM).

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

## Terraform (Azure)
- Código en `terraform/`
- Crea: VM, VNet, Subnet, Public IP, NSG (puertos 22/3000/3001 abiertos)
- Backend state en Azure Storage (`tfsaincentivos`)
- `provider.tf` tiene `prevent_deletion_if_contains_resources = false` para evitar bloqueos al recrear recursos
- `terraform.tfvars` con variables no sensibles (location, vm_size, etc.) subido al repo
- Variables sensibles (`db_password`, `jwt_secret`) se inyectan por SSH en el deploy, no por Terraform

### Comandos Terraform
```powershell
cd terraform
terraform init
terraform plan -out=tfplan
terraform apply -auto-approve tfplan
terraform destroy  # solo si quieres eliminar todo
```

## Jenkins CI/CD
**Pipeline completo** en `Jenkinsfile` (pull from GitHub):
1. **Terraform Init** → descarga providers y state
2. **Terraform Plan** → genera plan
3. **Terraform Apply** → aplica cambios en Azure
4. **Build Docker** → construye imagen con el código actual
5. **Push Docker Hub** → sube imagen a `camilaacevedo/backend-incentivos`
6. **Deploy** → SSH a la VM, inyecta credenciales, pull, up -d

### Cómo ejecutar Jenkins
```powershell
$env:JENKINS_HOME="C:\ProgramData\Jenkins\.jenkins"
java -jar "$env:USERPROFILE\jenkins.war" --httpPort=8081
```
Luego abrir `http://localhost:8081` y ejecutar pipeline.

### Credenciales en Jenkins
| ID | Tipo | Descripción |
|----|------|-------------|
| `ARM_ACCESS_KEY` | Secret text | Access key del storage account para state de Terraform |
| `TF_VAR_db_password` | Secret text | Contraseña de PostgreSQL |
| `TF_VAR_jwt_secret` | Secret text | Secreto para firmar JWT |
| `docker-hub-credentials` | Username/password | Login a Docker Hub |

### Estado actual de Azure
- Resource Group: `rg-incentivos-dev`
- VM: `vm-incentivos-dev` (Standard_D2s_v3, Ubuntu 22.04)
- IP Pública: `20.7.65.69`
- Frontend: `http://20.7.65.69:3001`
- API Gateway: `http://20.7.65.69:3000`
- SSH: `ssh azureuser@20.7.65.69`

## Comandos
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
terraform/                — Infraestructura Azure como código
  main.tf                 — Recursos (VM, VNet, NSG, etc.)
  provider.tf             — Provider AzureRM + backend state
  variables.tf            — Variables
  outputs.tf              — Outputs (IP, URLs)
  cloud-init.yml          — Script de bootstrap de la VM
  terraform.tfvars        — Valores no sensibles
Jenkinsfile               — Pipeline CI/CD completo
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
- Seed: admin@test.com / admin123

## Swagger
- Available at `http://localhost:3000/api-docs`
- Spec generated from JSDoc in `*.routes.ts` files

## Environment
- `.env` at workspace root (gitignored). Required vars: `PORT`, `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`
- Redis vars optional (`REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`)

## Docker
- All services share a single Dockerfile (`Dockerfile` in workspace root) using `node:20-alpine`
- Docker Compose files: root `docker-compose.yml` (prod, imágenes pre-construidas) y `backend_incentivos\docker-compose.yml` (dev, build local)
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
- Terraform state lock: no ejecutar `terraform apply` local mientras el pipeline de Jenkins corre
- Si Jenkins falla con "deleting Resource Group": el state está inconsistente, ejecutar `terraform apply` local primero
