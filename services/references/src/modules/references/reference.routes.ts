import { Router } from 'express'
import { createReference, getAllReferences, updateReference, deleteReference, activeReference } from './reference.controller'
import { authMiddleware, roleMiddleware, validate, idParamSchema } from '@incentivos/shared'
import { createReferenceSchema, updateReferenceSchema } from './reference.schema'

const router = Router()

router.post('/', authMiddleware, roleMiddleware('PRODUCCION'), validate({ body: createReferenceSchema }), createReference)
router.get('/', authMiddleware, roleMiddleware('PRODUCCION'), getAllReferences)
router.put('/:id', authMiddleware, roleMiddleware('PRODUCCION'), validate({ params: idParamSchema, body: updateReferenceSchema }), updateReference)
router.delete('/:id', authMiddleware, roleMiddleware('PRODUCCION'), validate({ params: idParamSchema }), deleteReference)
router.put('/:id/activate', authMiddleware, roleMiddleware('PRODUCCION'), validate({ params: idParamSchema }), activeReference)

export default router
