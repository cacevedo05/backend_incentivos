import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/users/users.routes';
import emplyeesRoutes from './modules/employees/employees.routes';
import referencesRoutes from "./modules/references/reference.routes"
import ordersRoutes from "./modules/orders/orders.routes"
import productionRoutes from "./modules/production/production.routes"
import workLogRoutes from "./modules/work-logs/work-logs.routes"
import liquidationRoutes from "./modules/liquidation/liquidation.routes"
import { errorMiddleware } from './shared/middlewares/error.middleware';

const app = express();

app.use(cors());
app.use(express.json());

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  swaggerOptions: {
    persistAuthorization: true,
  },
}));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/employees', emplyeesRoutes)
app.use('/api/references', referencesRoutes)
app.use('/api/orders', ordersRoutes)
app.use('/api/production', productionRoutes)
app.use('/api/work-logs', workLogRoutes)
app.use('/api/liquidation', liquidationRoutes)



app.get('/health', (req, res) => {
  res.json({ ok: true, message: 'API funcionando' });
});

app.use(errorMiddleware);

export default app;
