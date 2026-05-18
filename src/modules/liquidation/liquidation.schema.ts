import { z } from "zod";
import {
    dateStringSchema,
    nonEmptyString,
    positiveIntSchema
} from "../../shared/validations/common.schemas";

export const createLiquidationSchema = z
    .object({
        module: nonEmptyString("module", 10),
        start_date: dateStringSchema("start_date"),
        end_date: dateStringSchema("end_date"),
        created_user: nonEmptyString("created_user", 40).optional()
    })
    .refine((data) => data.end_date >= data.start_date, {
        path: ["end_date"],
        message: "end_date debe ser mayor o igual a start_date"
    });

export const createLiquidationDetailsSchema = z.object({
    liquidation_id: positiveIntSchema("liquidation_id"),
    employee_id: positiveIntSchema("employee_id"),
    module: nonEmptyString("module", 10),
    work_date: dateStringSchema("work_date"),
    worked_minutes: positiveIntSchema("worked_minutes"),
    downtime_minutes: positiveIntSchema("downtime_minutes"),
    produced_minutes: positiveIntSchema("produced_minutes"),
    efficiency: positiveIntSchema("efficiency"),
    incentive_base: positiveIntSchema("incentive_base"),
    payment: positiveIntSchema("payment")
});
