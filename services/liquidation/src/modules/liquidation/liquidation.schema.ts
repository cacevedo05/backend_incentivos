import { z } from 'zod'
import { dateStringSchema, nonEmptyString } from '@incentivos/shared'

export const createLiquidationSchema = z
  .object({
    module: nonEmptyString('module', 10),
    start_date: dateStringSchema('start_date'),
    end_date: dateStringSchema('end_date'),
    created_user: nonEmptyString('created_user', 40).optional(),
  })
  .refine((data) => data.end_date >= data.start_date, {
    path: ['end_date'],
    message: 'end_date debe ser mayor o igual a start_date',
  })
