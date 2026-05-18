import { Router } from 'express'
import { CreateOrder, GetOrders, UpdateOrder, DeleteOrder } from './orders.controller'
import { authMiddleware, roleMiddleware, validate, idParamSchema } from '@incentivos/shared'
import { createOrderSchema, updateOrderSchema } from './orders.schema'

const router = Router()

router.post('/', authMiddleware, roleMiddleware('PRODUCCION'), validate({ body: createOrderSchema }), CreateOrder)
router.get('/', authMiddleware, roleMiddleware('PRODUCCION'), GetOrders)
router.put('/:id', authMiddleware, roleMiddleware('PRODUCCION'), validate({ params: idParamSchema, body: updateOrderSchema }), UpdateOrder)
router.delete('/:id', authMiddleware, roleMiddleware('PRODUCCION'), validate({ params: idParamSchema }), DeleteOrder)

export default router
