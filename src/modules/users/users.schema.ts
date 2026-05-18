import { z } from "zod";
import {
    atLeastOneField,
    emailSchema,
    nonEmptyString,
    passwordSchema
} from "../../shared/validations/common.schemas";

const roleSchema = z.enum(["ADMIN", "PRODUCCION", "RH"], {
    error: "role debe ser ADMIN, PRODUCCION o RH"
});

export const createUserSchema = z.object({
    name: nonEmptyString("name", 50),
    email: emailSchema,
    password: passwordSchema,
    role: roleSchema
});

export const updateUserSchema = atLeastOneField(
    z.object({
        name: nonEmptyString("name", 50).optional(),
        email: emailSchema.optional(),
        password: passwordSchema.optional(),
        role: roleSchema.optional(),
        active: z.boolean({ error: "active debe ser booleano" }).optional()
    })
);

export const changePasswordSchema = z.object({
    currentPassword: nonEmptyString("currentPassword", 255),
    newPassword: passwordSchema
});

