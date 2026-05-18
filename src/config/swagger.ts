import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Gestión de Incentivos',
      version: '1.0.0',
      description: 'Sistema de gestión integral de incentivos y liquidación de pagos para empleados en procesos de producción',
      contact: {
        name: 'Soporte',
        email: 'support@incentivos.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desarrollo',
      },
      {
        url: 'https://api.incentivos.com',
        description: 'Servidor de producción',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Ingresa tu token JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            email: { type: 'string' },
            name: { type: 'string' },
            role: { type: 'string', enum: ['ADMIN', 'PRODUCCION', 'RH'] },
            active: { type: 'boolean' },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        Employee: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            document: { type: 'string' },
            name: { type: 'string' },
            address: { type: 'string' },
            phone: { type: 'string' },
            email: { type: 'string' },
            module: { type: 'string' },
            active: { type: 'boolean' },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        ProductReference: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            reference: { type: 'string' },
            color: { type: 'string' },
            size: { type: 'string' },
            standard_time: { type: 'number', format: 'double' },
            description: { type: 'string' },
            active: { type: 'boolean' },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        ProductionOrder: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            reference_id: { type: 'integer' },
            quantity: { type: 'integer' },
            module: { type: 'string' },
            status: { type: 'string' },
            quantity_pending: { type: 'integer' },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        ProductionRecord: {
          type: 'object',
          required: ['id', 'order_id', 'reference_id', 'module', 'units', 'standard_time', 'total_time'],
          properties: {
            id: { type: 'integer' },
            order_id: { type: 'integer' },
            reference_id: { type: 'integer' },
            module: { type: 'string' },
            units: { type: 'integer' },
            standard_time: { type: 'number', format: 'double' },
            total_time: { type: 'number', format: 'double' },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        CreateProductionProcess: {
          type: 'object',
          required: ['order_id', 'units'],
          properties: {
            order_id: {
              type: 'integer',
              description: 'ID de la orden de producción abierta',
            },
            units: {
              type: 'integer',
              minimum: 1,
              description: 'Unidades producidas en este registro',
            },
          },
        },
        UpdateProductionProcess: {
          type: 'object',
          required: ['units'],
          properties: {
            units: {
              type: 'integer',
              minimum: 1,
              description: 'Nueva cantidad de unidades del último registro de producción de la orden',
            },
          },
        },
        WorkLog: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            employee_id: { type: 'integer' },
            production_record_id: { type: 'integer' },
            work_date: { type: 'string', format: 'date' },
            worked_minutes: { type: 'integer' },
            downtime_minutes: { type: 'integer' },
            produced_minutes: { type: 'number', format: 'double' },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        Liquidation: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            module: { type: 'string' },
            start_date: { type: 'string', format: 'date' },
            end_date: { type: 'string', format: 'date' },
            created_user: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        LiquidationDetail: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            liquidation_id: { type: 'integer' },
            employee_id: { type: 'integer' },
            module: { type: 'string' },
            work_date: { type: 'string', format: 'date' },
            worked_minutes: { type: 'integer' },
            downtime_minutes: { type: 'integer' },
            produced_minutes: { type: 'number', format: 'double' },
            efficiency: { type: 'number', format: 'double' },
            incentive_base: { type: 'number', format: 'double' },
            payment: { type: 'number', format: 'double' },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/modules/**/*.routes.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
