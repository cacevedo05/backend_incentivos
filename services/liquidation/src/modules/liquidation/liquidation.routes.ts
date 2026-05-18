import { Router } from 'express'
import { createLiquidation, getLiquidation, getLiquidationDetails } from './liquidation.controller'
import { authMiddleware, roleMiddleware, validate, idParamSchema } from '@incentivos/shared'
import { createLiquidationSchema } from './liquidation.schema'

const router = Router()

router.post('/', authMiddleware, roleMiddleware('PRODUCCION'), validate({ body: createLiquidationSchema }), createLiquidation)
router.get('/', authMiddleware, roleMiddleware('PRODUCCION'), getLiquidation)
router.get('/:id', authMiddleware, roleMiddleware('PRODUCCION'), validate({ params: idParamSchema }), getLiquidationDetails)

export default router
