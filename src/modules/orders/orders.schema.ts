import { z } from "zod";
import {
    atLeastOneField,
    nonEmptyString,
    positiveIntSchema
} from "../../shared/validations/common.schemas";

const orderStatusSchema = z.enum(["ABIERTA", "CERRADA", "CANCELADA"], {
    error: "status debe ser ABIERTA, CERRADA o CANCELADA"
});

export const createOrderSchema = z.object({
    reference_id: positiveIntSchema("reference_id"),
    quantity: positiveIntSchema("quantity"),
    quantity_pending: positiveIntSchema("quantity_pending").optional(),
    module: nonEmptyString("module", 10)
});

export const updateOrderSchema = atLeastOneField(
    z.object({
        quantity: positiveIntSchema("quantity").optional(),
        module: nonEmptyString("module", 10).optional(),
        status: orderStatusSchema.optional()
    })
);

