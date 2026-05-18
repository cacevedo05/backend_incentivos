import { Router } from 'express'
import { createEmployees, getAllEmployees, updateEmployees, delteEmployees, activateEmployees } from './employees.controller'
import { authMiddleware, roleMiddleware, validate, idParamSchema } from '@incentivos/shared'
import { createEmployeesSchema, updateEmployeesSchema } from './employees.schema'

const router = Router()

router.post('/', authMiddleware, roleMiddleware('RH'), validate({ body: createEmployeesSchema }), createEmployees)
router.get('/', authMiddleware, roleMiddleware('RH'), getAllEmployees)
router.put('/:id', authMiddleware, roleMiddleware('RH'), validate({ params: idParamSchema, body: updateEmployeesSchema }), updateEmployees)
router.delete('/:id', authMiddleware, roleMiddleware('RH'), validate({ params: idParamSchema }), delteEmployees)
router.put('/:id/activate', authMiddleware, roleMiddleware('RH'), validate({ params: idParamSchema }), activateEmployees)

export default router
