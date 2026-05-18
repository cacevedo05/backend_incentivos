import { z } from 'zod'
import { atLeastOneField, emailSchema, nonEmptyString } from '@incentivos/shared'

const documentSchema = nonEmptyString('document', 20).regex(
  /^\d+$/, 'document debe contener solo numeros'
)

const phoneSchema = nonEmptyString('phone', 13).regex(
  /^\+?\d{7,13}$/, 'phone debe contener entre 7 y 13 digitos, opcionalmente con + al inicio'
)

export const createEmployeesSchema = z.object({
  documentType: nonEmptyString('documentType', 20),
  document: documentSchema,
  name: nonEmptyString('name', 50),
  address: nonEmptyString('address', 50).optional(),
  phone: phoneSchema.optional(),
  email: emailSchema.optional(),
  module: nonEmptyString('module', 5),
})

export const updateEmployeesSchema = atLeastOneField(
  z.object({
    documentType: nonEmptyString('documentType', 20).optional(),
    document: documentSchema.optional(),
    name: nonEmptyString('name', 50).optional(),
    address: nonEmptyString('address', 50).optional(),
    phone: phoneSchema.optional(),
    email: emailSchema.optional(),
    module: nonEmptyString('module', 5).optional(),
  })
)
