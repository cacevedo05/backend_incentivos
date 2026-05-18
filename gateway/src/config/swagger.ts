import swaggerJsdoc from 'swagger-jsdoc'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Gestión de Incentivos',
      version: '1.0.0',
      description:
        'Sistema de gestión integral de incentivos y liquidación de pagos para empleados en procesos de producción',
    },
    servers: [
      { url: 'http://localhost:3000', description: 'API Gateway (desarrollo)' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: [
    './services/auth/src/modules/**/*.routes.ts',
    './services/employees/src/modules/**/*.routes.ts',
    './services/references/src/modules/**/*.routes.ts',
    './services/orders/src/modules/**/*.routes.ts',
    './services/production/src/modules/**/*.routes.ts',
    './services/work-logs/src/modules/**/*.routes.ts',
    './services/liquidation/src/modules/**/*.routes.ts',
  ],
}

export const swaggerSpec = swaggerJsdoc(options)
