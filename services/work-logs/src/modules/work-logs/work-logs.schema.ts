import { z } from 'zod'
import { dateStringSchema, nonEmptyString, nonNegativeIntSchema, positiveIntSchema } from '@incentivos/shared'

export const createWorkLogSchema = z
  .object({
    employee_id: positiveIntSchema('employee_id'),
    module: nonEmptyString('module', 10),
    work_date: dateStringSchema('work_date'),
    minutes_worked: positiveIntSchema('minutes_worked'),
    minutes_downtime: nonNegativeIntSchema('minutes_downtime'),
  })
  .refine((data) => data.minutes_downtime <= data.minutes_worked, {
    path: ['minutes_downtime'],
    message: 'minutes_downtime no puede ser mayor que minutes_worked',
  })

export const updateWorkLogSchema = z
  .object({
    minutes_worked: positiveIntSchema('minutes_worked'),
    minutes_downtime: nonNegativeIntSchema('minutes_downtime'),
  })
  .refine((data) => data.minutes_downtime <= data.minutes_worked, {
    path: ['minutes_downtime'],
    message: 'minutes_downtime no puede ser mayor que minutes_worked',
  })
