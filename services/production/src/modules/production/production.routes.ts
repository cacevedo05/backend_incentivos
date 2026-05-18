import { Router } from 'express'
import { createProduction, getAllProduction, updateProduction, deleteProduction } from './production.controller'
import { authMiddleware, roleMiddleware, validate, idParamSchema } from '@incentivos/shared'
import { createProductionSchema, updateProductionSchema } from './production.schema'

const router = Router()

router.post('/', authMiddleware, roleMiddleware('PRODUCCION'), validate({ body: createProductionSchema }), createProduction)
router.get('/', authMiddleware, roleMiddleware('PRODUCCION'), getAllProduction)
router.put('/:id', authMiddleware, roleMiddleware('PRODUCCION'), validate({ params: idParamSchema, body: updateProductionSchema }), updateProduction)
router.delete('/:id', authMiddleware, roleMiddleware('PRODUCCION'), validate({ params: idParamSchema }), deleteProduction)

export default router
