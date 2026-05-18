import { z } from 'zod'
import { atLeastOneField, positiveIntSchema } from '@incentivos/shared'

export const createProductionSchema = z.object({
  order_id: positiveIntSchema('order_id'),
  units: positiveIntSchema('units'),
})

export const updateProductionSchema = atLeastOneField(
  z.object({ units: positiveIntSchema('units').optional() })
)
