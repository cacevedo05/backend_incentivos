import { Router } from 'express'
import { createWorkLog, updateWorLog, getAllWorkLogs, deleteWorkLog } from './work-logs.controller'
import { authMiddleware, roleMiddleware, validate, idParamSchema } from '@incentivos/shared'
import { createWorkLogSchema, updateWorkLogSchema } from './work-logs.schema'

const router = Router()

router.post('/', authMiddleware, roleMiddleware('PRODUCCION'), validate({ body: createWorkLogSchema }), createWorkLog)
router.get('/', authMiddleware, roleMiddleware('PRODUCCION'), getAllWorkLogs)
router.put('/:id', authMiddleware, roleMiddleware('PRODUCCION'), validate({ params: idParamSchema, body: updateWorkLogSchema }), updateWorLog)
router.delete('/:id', authMiddleware, roleMiddleware('PRODUCCION'), validate({ params: idParamSchema }), deleteWorkLog)

export default router
