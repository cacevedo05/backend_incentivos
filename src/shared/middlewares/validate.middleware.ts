import { NextFunction, Request, RequestHandler, Response } from "express";
import { ZodError, ZodIssue, ZodType } from "zod";

type ValidationSchemas = {
    body?: ZodType;
    params?: ZodType;
    query?: ZodType;
};

type RequestSource = keyof ValidationSchemas;

type FormattedValidationError = {
    source: RequestSource;
    field: string;
    message: string;
    code: string;
};

const getField = (issue: ZodIssue) => issue.path.join(".") || "request";

const getFriendlyMessage = (issue: ZodIssue) => {
    const field = getField(issue);
    const input = (issue as any).input;

    if (issue.code === "invalid_type" && input === undefined) {
        return `${field} es obligatorio`;
    }

    if (issue.code === "invalid_type" && input === null) {
        return `${field} no puede ser null`;
    }

    if (issue.code === "unrecognized_keys") {
        return `La solicitud contiene campos no permitidos`;
    }

    return issue.message;
};

const formatZodError = (
    error: ZodError,
    source: RequestSource
): FormattedValidationError[] =>
    error.issues.map((issue) => ({
        source,
        field: getField(issue),
        message: getFriendlyMessage(issue),
        code: issue.code
    }));

const validateSource = (
    schema: ZodType | undefined,
    value: unknown,
    source: RequestSource
) => {
    if (!schema) {
        return { data: value, errors: [] as FormattedValidationError[] };
    }

    const result = schema.safeParse(value);

    if (result.success) {
        return { data: result.data, errors: [] as FormattedValidationError[] };
    }

    return {
        data: value,
        errors: formatZodError(result.error, source)
    };
};

const buildValidationMessage = (errors: FormattedValidationError[]) => {
    const messages = [...new Set(errors.map((error) => error.message))];

    if (messages.length === 0) {
        return "La solicitud contiene datos invalidos";
    }

    if (messages.length === 1) {
        return messages[0];
    }

    return messages.join("; ");
};

const buildFieldsMap = (errors: FormattedValidationError[]) =>
    errors.reduce<Record<string, string[]>>((acc, error) => {
        const key = `${error.source}.${error.field}`;
        acc[key] = acc[key] || [];
        acc[key].push(error.message);
        return acc;
    }, {});

export const validate = (schemas: ValidationSchemas): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const paramsResult = validateSource(schemas.params, req.params, "params");
            const queryResult = validateSource(schemas.query, req.query, "query");
            const bodyResult = validateSource(schemas.body, req.body, "body");

            const errors = [
                ...paramsResult.errors,
                ...queryResult.errors,
                ...bodyResult.errors
            ];

            if (errors.length > 0) {
                res.status(400).json({
                    message: buildValidationMessage(errors),
                    errors,
                    fields: buildFieldsMap(errors)
                });
                return;
            }

            if (schemas.params) {
                req.params = paramsResult.data as Record<string, string>;
            }

            if (schemas.query) {
                req.query = queryResult.data as Request["query"];
            }

            if (schemas.body) {
                req.body = bodyResult.data;
            }

            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const errors = formatZodError(error, "body");

                res.status(400).json({
                    message: buildValidationMessage(errors),
                    errors,
                    fields: buildFieldsMap(errors)
                });
                return;
            }

            next(error);
        }
    };
};
