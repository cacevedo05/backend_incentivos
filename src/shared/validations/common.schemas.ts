import { z } from "zod";

const noBlankMessage = "No puede estar vacio";
const noEdgeSpacesMessage = "No debe iniciar ni terminar con espacios";

export const nonEmptyString = (field: string, max?: number) => {
    let schema = z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? `${field} es obligatorio`
                    : `${field} debe ser texto`
        })
        .refine((value) => value.trim().length > 0, `${field} ${noBlankMessage}`)
        .refine((value) => value === value.trim(), `${field} ${noEdgeSpacesMessage}`);

    if (max) {
        schema = schema.max(max, `${field} no puede superar ${max} caracteres`);
    }

    return schema;
};

export const optionalString = (field: string, max?: number) =>
    nonEmptyString(field, max).optional();

export const emailSchema = nonEmptyString("email", 50)
    .email("email debe tener un formato valido")
    .refine((value) => !/\s/.test(value), "email no debe contener espacios");

export const passwordSchema = nonEmptyString("password", 255).min(
    6,
    "password debe tener minimo 6 caracteres"
);

export const positiveIntSchema = (field: string) =>
    z.coerce
        .number({
            error: (issue) =>
                issue.input === undefined || issue.input === ""
                    ? `${field} es obligatorio`
                    : `${field} debe ser numerico`
        })
        .int(`${field} debe ser un numero entero`)
        .positive(`${field} debe ser mayor que 0`);

export const nonNegativeIntSchema = (field: string) =>
    z.coerce
        .number({
            error: (issue) =>
                issue.input === undefined || issue.input === ""
                    ? `${field} es obligatorio`
                    : `${field} debe ser numerico`
        })
        .int(`${field} debe ser un numero entero`)
        .min(0, `${field} no puede ser negativo`);

export const positiveNumberSchema = (field: string) =>
    z.coerce
        .number({
            error: (issue) =>
                issue.input === undefined || issue.input === ""
                    ? `${field} es obligatorio`
                    : `${field} debe ser numerico`
        })
        .positive(`${field} debe ser mayor que 0`);

export const idParamSchema = z.object({
    id: positiveIntSchema("id")
});

export const dateStringSchema = (field: string) =>
    nonEmptyString(field)
        .regex(/^\d{4}-\d{2}-\d{2}$/, `${field} debe tener formato YYYY-MM-DD`)
        .refine((value) => {
            const date = new Date(`${value}T00:00:00.000Z`);
            return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
        }, `${field} debe ser una fecha valida`);

export const atLeastOneField = <T extends z.ZodRawShape>(schema: z.ZodObject<T>) =>
    schema.refine((value) => Object.keys(value).length > 0, {
        message: "Debe enviar al menos un campo para actualizar"
    });
