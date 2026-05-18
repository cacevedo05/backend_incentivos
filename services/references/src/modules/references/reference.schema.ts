import { z } from 'zod'
import { atLeastOneField, nonEmptyString, optionalString, positiveNumberSchema } from '@incentivos/shared'

export const createReferenceSchema = z.object({
  reference: nonEmptyString('reference', 50),
  color: nonEmptyString('color', 30),
  size: nonEmptyString('size', 10),
  standard_time: positiveNumberSchema('standard_time'),
  description: optionalString('description', 100),
})

export const updateReferenceSchema = atLeastOneField(
  z.object({
    standard_time: positiveNumberSchema('standard_time').optional(),
    description: optionalString('description', 100),
  })
)
