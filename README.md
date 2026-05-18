# Backend Gestión de Incentivos 📊

Sistema backend para la gestión integral de incentivos y liquidación de pagos para empleados en procesos de producción.

## 📋 Descripción del Proyecto

Este es un backend desarrollado en **Node.js + Express + TypeScript** que proporciona una API REST completa para:

- **Gestión de Empleados**: Registro, actualización y administración de datos de empleados por módulos de producción
- **Control de Producción**: Registro de órdenes y registros de producción con tiempos estándar
- **Logs de Trabajo**: Seguimiento detallado de tiempos trabajados, tiempos muertos y eficiencia
- **Liquidación de Incentivos**: Cálculo automático de incentivos basados en reglas configurables y eficiencia del trabajador
- **Gestión de Usuarios y Roles**: Sistema de autenticación con JWT y control de acceso basado en roles (ADMIN, PRODUCCION, RH)
- **Referencias de Productos**: Catálogo de referencias con información de colores, tamaños y tiempos estándar

## 🔧 Tecnologías Utilizadas

- **Runtime**: Node.js
- **Lenguaje**: TypeScript 6.0.2
- **Framework Web**: Express 5.2.1
- **Base de Datos**: PostgreSQL 18.3
- **Autenticación**: JWT (jsonwebtoken 9.0.3)
- **Encriptación**: Bcrypt 5.1.1
- **Cache**: Redis (ioredis 5.10.1)
- **CORS**: cors 2.8.6
- **Documentación API**: Swagger/OpenAPI

## 📦 Dependencias

### Dependencias de Producción
```json
{
  "bcrypt": "^5.1.1",
  "cors": "^2.8.6",
  "dotenv": "^17.3.1",
  "express": "^5.2.1",
  "ioredis": "^5.10.1",
  "jsonwebtoken": "^9.0.3",
  "module-alias": "^2.3.4",
  "pg": "^8.20.0",
  "swagger-ui-express": "^4.6.3",
  "swagger-jsdoc": "^6.2.8"
}
```

### Dependencias de Desarrollo
```json
{
  "@types/bcrypt": "^5.0.0",
  "@types/cors": "^2.8.19",
  "@types/express": "^4.17.25",
  "@types/jsonwebtoken": "^9.0.2",
  "@types/module-alias": "^2.0.4",
  "@types/node": "^20.19.37",
  "@types/pg": "^8.20.0",
  "@types/swagger-ui-express": "^4.1.6",
  "ts-node-dev": "^2.0.0",
  "tsx": "^4.21.0",
  "typescript": "^6.0.2"
}
```

## 🚀 Guía de Instalación

### Requisitos Previos
- Node.js v18+ 
- PostgreSQL v18+
- Redis (opcional, para caché)

### Paso 1: Clonar el Repositorio
```bash
git clone <url-del-repositorio>
cd backend_incentivos
```

### Paso 2: Instalar Dependencias
```bash
npm install
```

### Paso 3: Configurar Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
# Puerto del servidor
PORT=3000

# Configuración de Base de Datos PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=tu_contraseña_postgres
DB_NAME=incentivos

# Configuración JWT
JWT_SECRET=tu_secreto_jwt_super_seguro_y_largo

# Opcional: Configuración Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
```

### Paso 4: Crear la Base de Datos

#### Opción A: Con PostgreSQL CLI
```bash
# Crear la base de datos
psql -U postgres -c "CREATE DATABASE incentivos;"

# Cargar el schema
psql -U postgres -d incentivos -f schema.sql
```

#### Opción B: Con pgAdmin
1. Abre pgAdmin en `http://localhost:5050`
2. Crea una nueva base de datos llamada `incentivos`
3. Abre una herramienta de query
4. Copia y ejecuta el contenido del archivo `schema.sql`

### Paso 5: Compilar TypeScript
```bash
npm run build
```

### Paso 6: Ejecutar el Servidor

#### Desarrollo (con hot-reload)
```bash
npm run dev
```

#### Producción
```bash
npm start
```

El servidor estará disponible en `http://localhost:3000`

## 📚 Estructura de la Base de Datos

### Tablas Principales

#### `employees` - Empleados
```sql
id INTEGER (PK)
document VARCHAR(20) - Número de documento
name VARCHAR(50) - Nombre del empleado
address VARCHAR(50) - Dirección
phone VARCHAR(13) - Teléfono
email VARCHAR(50) - Correo electrónico
module VARCHAR(5) - Módulo asignado
active BOOLEAN - Estado activo/inactivo
created_at TIMESTAMP - Fecha de creación
```

#### `product_references` - Referencias de Productos
```sql
id INTEGER (PK)
reference VARCHAR(50) - Código de referencia
color VARCHAR(30) - Color del producto
size VARCHAR(10) - Tamaño
standard_time NUMERIC(10,2) - Tiempo estándar en minutos
description VARCHAR(100) - Descripción
active BOOLEAN - Estado activo
created_at TIMESTAMP - Fecha de creación
```

#### `production_orders` - Órdenes de Producción
```sql
id INTEGER (PK)
reference_id INTEGER (FK) - Referencia del producto
quantity INTEGER - Cantidad a producir
module VARCHAR(10) - Módulo de producción
status VARCHAR(20) - Estado (ABIERTA, CERRADA, etc)
quantity_pending INTEGER - Cantidad pendiente
created_at TIMESTAMP - Fecha de creación
```

#### `production_records` - Registros de Producción
```sql
id INTEGER (PK)
order_id INTEGER (FK) - Orden de producción
reference_id INTEGER (FK) - Referencia del producto
module VARCHAR(10) - Módulo
units INTEGER - Unidades producidas
standard_time NUMERIC(10,2) - Tiempo estándar
total_time NUMERIC(10,2) - Tiempo total invertido
created_at TIMESTAMP - Fecha de creación
```

#### `work_logs` - Registros de Trabajo
```sql
id INTEGER (PK)
employee_id INTEGER (FK) - Empleado
production_record_id INTEGER (FK) - Registro de producción
work_date DATE - Fecha del trabajo
worked_minutes INTEGER - Minutos trabajados
downtime_minutes INTEGER - Minutos de parada
produced_minutes NUMERIC(10,2) - Minutos producidos
created_at TIMESTAMP - Fecha de creación
```

#### `liquidations` - Liquidaciones
```sql
id INTEGER (PK)
module VARCHAR(10) - Módulo
start_date DATE - Fecha inicial del periodo
end_date DATE - Fecha final del periodo
created_user VARCHAR(40) - Usuario que creó
created_at TIMESTAMP - Fecha de creación
```

#### `liquidation_details` - Detalles de Liquidación
```sql
id INTEGER (PK)
liquidation_id INTEGER (FK) - Liquidación
employee_id INTEGER (FK) - Empleado
module VARCHAR(10) - Módulo
work_date DATE - Fecha del trabajo
worked_minutes INTEGER - Minutos trabajados
downtime_minutes INTEGER - Minutos de parada
produced_minutes NUMERIC(10,2) - Minutos producidos
efficiency NUMERIC(10,2) - Porcentaje de eficiencia
incentive_base NUMERIC(10,2) - Base para incentivo
payment NUMERIC(10,2) - Valor del incentivo pagado
created_at TIMESTAMP - Fecha de creación
```

#### `incentive_rules` - Reglas de Incentivos
```sql
id INTEGER (PK)
efficiency_point INTEGER - Punto de eficiencia (%)
value NUMERIC(10,2) - Valor en dinero para ese punto
```

## 🔐 Sistema de Autenticación

### Roles Disponibles
- **ADMIN**: Acceso total a todas las funcionalidades
- **PRODUCCION**: Acceso a órdenes, registros de producción y logs de trabajo
- **RH**: Acceso a gestión de empleados

### Flujo de Autenticación

1. **Login**: Enviar credenciales (email/documento, contraseña)
   ```bash
   POST /api/auth/login
   ```

2. **Token JWT**: Se retorna un token válido por tiempo determinado
3. **Requests Autenticados**: Incluir header `Authorization: Bearer {token}`

## 📡 Endpoints de la API

### Autenticación
- `POST /api/auth/login` - Login de usuarios

### Usuarios
- `POST /api/users` - Crear usuario (ADMIN)
- `GET /api/users` - Listar usuarios (ADMIN)
- `PUT /api/users/:id` - Actualizar usuario (ADMIN)
- `DELETE /api/users/:id` - Eliminar usuario (ADMIN)
- `PUT /api/users/:id/password` - Cambiar contraseña (ADMIN)
- `PUT /api/users/:id/activate` - Activar usuario (ADMIN)

### Empleados
- `POST /api/employees` - Crear empleado (RH)
- `GET /api/employees` - Listar empleados (RH)
- `PUT /api/employees/:id` - Actualizar empleado (RH)
- `DELETE /api/employees/:id` - Eliminar empleado (RH)
- `PUT /api/employees/:id/activate` - Activar empleado (RH)

### Referencias de Productos
- `POST /api/references` - Crear referencia (PRODUCCION)
- `GET /api/references` - Listar referencias (PRODUCCION)
- `PUT /api/references/:id` - Actualizar referencia (PRODUCCION)
- `DELETE /api/references/:id` - Eliminar referencia (PRODUCCION)
- `PUT /api/references/:id/activate` - Activar referencia (PRODUCCION)

### Órdenes de Producción
- `POST /api/orders` - Crear orden
- `GET /api/orders` - Listar órdenes (PRODUCCION)
- `PUT /api/orders/:id` - Actualizar orden (PRODUCCION)
- `DELETE /api/orders/:id` - Eliminar orden (PRODUCCION)

### Registros de Producción
- `POST /api/production` - Crear registro (PRODUCCION)
- `PUT /api/production/:id` - Actualizar registro (PRODUCCION)
- `DELETE /api/production/:id` - Eliminar registro (PRODUCCION)

### Logs de Trabajo
- `POST /api/work-logs` - Crear log de trabajo (PRODUCCION)
- `PUT /api/work-logs/:id` - Actualizar log (PRODUCCION)
- `GET /api/work-logs` - Listar logs (PRODUCCION)
- `DELETE /api/work-logs/:id` - Eliminar log (PRODUCCION)

### Liquidación de Incentivos
- `POST /api/liquidation` - Crear liquidación (PRODUCCION)
- `GET /api/liquidation` - Listar liquidaciones (PRODUCCION)
- `GET /api/liquidation/:id` - Obtener detalles de liquidación (PRODUCCION)

### Health Check
- `GET /health` - Verificar estado del servidor

## 📖 Documentación Interactiva

La API incluye documentación Swagger/OpenAPI. Una vez iniciado el servidor, accede a:

```
http://localhost:3000/api-docs
```

Aquí puedes:
- Ver todos los endpoints documentados
- Probar los endpoints directamente
- Ver los modelos de datos
- Ver códigos de respuesta esperados

## 🧪 Prueba de Endpoints

### Con Postman o Insomnia

1. **Descarga Postman**: https://www.postman.com/downloads/
2. **Login primero**:
   - Método: `POST`
   - URL: `http://localhost:3000/api/auth/login`
   - Body (JSON):
     ```json
     {
       "email": "admin@example.com",
       "password": "password123"
     }
     ```
3. **Copiar el token JWT** de la respuesta
4. **En otros endpoints**, agregar header:
   - Key: `Authorization`
   - Value: `Bearer {token_copiado}`

### Con Swagger UI (Recomendado)

1. Abre `http://localhost:3000/api-docs`
2. Haz clic en "Authorize" e ingresa tu token JWT
3. Todos los endpoints estarán disponibles para probar

## 💻 Scripts Disponibles

```bash
# Desarrollo con hot-reload
npm run dev

# Compilar TypeScript
npm run build

# Ejecutar aplicación compilada
npm start
```

## 📁 Estructura del Proyecto

```
backend_incentivos/
├── src/
│   ├── app.ts                      # Configuración principal de Express
│   ├── server.ts                   # Punto de entrada
│   ├── config/
│   │   └── env.ts                  # Variables de entorno
│   ├── modules/                    # Módulos de la aplicación
│   │   ├── auth/                   # Autenticación
│   │   ├── users/                  # Gestión de usuarios
│   │   ├── employees/              # Gestión de empleados
│   │   ├── references/             # Referencias de productos
│   │   ├── orders/                 # Órdenes de producción
│   │   ├── production/             # Registros de producción
│   │   ├── work-logs/              # Logs de trabajo
│   │   └── liquidation/            # Liquidación de incentivos
│   └── shared/
│       ├── db/                     # Configuración de base de datos
│       ├── middlewares/            # Middlewares (auth, roles)
│       └── utils/                  # Utilidades
├── schema.sql                      # Script de creación de BD
├── package.json                    # Dependencias del proyecto
├── tsconfig.json                   # Configuración de TypeScript
├── .env.example                    # Ejemplo de variables de entorno
└── README.md                       # Este archivo
```

## 🔍 Arquitectura

El proyecto sigue el patrón **MVC (Model-View-Controller)** con separación de responsabilidades:

- **Controllers**: Manejan las solicitudes HTTP
- **Services**: Contienen la lógica de negocio
- **Repositories**: Acceso a datos y consultas a BD
- **Models**: Definición de estructuras de datos
- **DTOs**: Data Transfer Objects para validación
- **Routes**: Definición de rutas HTTP
- **Middlewares**: Autenticación, autorización, validación

## 🚨 Manejo de Errores

Todos los endpoints retornan respuestas estructuradas:

**Éxito (200)**:
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com"
}
```

**Error (400/401/403)**:
```json
{
  "message": "Descripción del error"
}
```

## 📝 Ejemplo de Uso Completo

```bash
# 1. Iniciar servidor
npm run dev

# 2. Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'

# Copiar el token de la respuesta (ej: eyJhbGc...)

# 3. Usar el token en otro endpoint
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer eyJhbGc..."

# 4. Ver la documentación Swagger
# Abre en el navegador: http://localhost:3000/api-docs
```

## 🐛 Troubleshooting

### Error: "Error: connect ECONNREFUSED 127.0.0.1:5432"
- Verifica que PostgreSQL esté corriendo
- Verifica las credenciales en el `.env`

### Error: "JWT malformed"
- Asegúrate que incluyes el header `Authorization: Bearer {token}`
- El token podría haber expirado

### Puerto 3000 ya está en uso
```bash
# Cambiar puerto en .env
PORT=3001
```

## 📧 Soporte

Para reportar bugs o sugerencias, crear un issue en el repositorio.

## 📄 Licencia

Este proyecto está bajo licencia ISC.

---

**Última actualización**: 20 de abril de 2026
