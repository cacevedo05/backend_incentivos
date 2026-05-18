import { z } from "zod";
import { emailSchema, passwordSchema } from "../../shared/validations/common.schemas";

export const loginSchema = z.object({
    email: emailSchema,
    password: passwordSchema
});

