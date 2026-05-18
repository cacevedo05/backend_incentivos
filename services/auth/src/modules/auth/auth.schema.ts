import { z } from 'zod'
import { emailSchema, passwordSchema } from '@incentivos/shared'

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
})
