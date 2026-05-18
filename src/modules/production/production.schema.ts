import { z } from "zod";
import {
    atLeastOneField,
    nonEmptyString,
    positiveIntSchema,
    positiveNumberSchema
} from "../../shared/validations/common.schemas";

export const createProductionSchema = z.object({
    order_id: positiveIntSchema("order_id"),
    units: positiveIntSchema("units")
});

export const updateProductionSchema = atLeastOneField(
    z.object({
        units: positiveIntSchema("units").optional()
    })
);

export const createProductionFinishSchema = z.object({
    order_id: positiveIntSchema("order_id"),
    reference_id: positiveIntSchema("reference_id"),
    units: positiveIntSchema("units"),
    module: nonEmptyString("module", 10),
    standard_time: positiveNumberSchema("standard_time"),
    total_time: positiveNumberSchema("total_time")
});

export const updateProductionFinishSchema = atLeastOneField(
    z.object({
        units: positiveIntSchema("units").optional(),
        total_time: positiveNumberSchema("total_time").optional()
    })
);

