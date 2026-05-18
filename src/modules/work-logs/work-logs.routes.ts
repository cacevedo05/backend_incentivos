import { Router } from "express";
import { 
    createWorkLog,
    updateWorLog,
    getAllWorkLogs,
    deleteWorkLog
 } from "./work-logs.controller";
 import { authMiddleware } from "../../shared/middlewares/auth.middleware";
 import { roleMiddleware } from "../../shared/middlewares/role.middleware";
 import { validate } from "../../shared/middlewares/validate.middleware";
 import { idParamSchema } from "../../shared/validations/common.schemas";
 import { createWorkLogSchema, updateWorkLogSchema } from "./work-logs.schema";

 const router = Router();

/**
  * @swagger
  * /api/work-logs:
  *   post:
  *     summary: Crear registro de trabajo
  *     tags:
  *       - Logs de Trabajo
  *     security:
  *       - bearerAuth: []
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             required:
  *               - employee_id
  *               - production_record_id
  *               - work_date
  *               - worked_minutes
  *               - downtime_minutes
  *             properties:
  *               employee_id:
  *                 type: integer
  *               production_record_id:
  *                 type: integer
  *               work_date:
  *                 type: string
  *                 format: date
  *               worked_minutes:
  *                 type: integer
  *               downtime_minutes:
  *                 type: integer
  *               produced_minutes:
  *                 type: number
  *     responses:
  *       201:
  *         description: Registro creado exitosamente
  *         content:
  *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/WorkLog'
  *       400:
  *         description: Error en la solicitud
  *   get:
  *     summary: Obtener todos los registros de trabajo
  *     tags:
  *       - Logs de Trabajo
  *     security:
  *       - bearerAuth: []
  *     responses:
  *       200:
  *         description: Lista de registros
  *         content:
  *           application/json:
  *             schema:
  *               type: array
  *               items:
  *                 $ref: '#/components/schemas/WorkLog'
  *       400:
  *         description: Error en la solicitud
  */
 router.post("/", authMiddleware, roleMiddleware("PRODUCCION"), validate({ body: createWorkLogSchema }), createWorkLog);

/**
  * @swagger
  * /api/work-logs/{id}:
  *   put:
  *     summary: Actualizar registro de trabajo
  *     tags:
  *       - Logs de Trabajo
  *     security:
  *       - bearerAuth: []
  *     parameters:
  *       - in: path
  *         name: id
  *         required: true
  *         schema:
  *           type: integer
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
  *               worked_minutes:
  *                 type: integer
  *               downtime_minutes:
  *                 type: integer
  *               produced_minutes:
  *                 type: number
  *     responses:
  *       200:
  *         description: Registro actualizado
  *         content:
  *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/WorkLog'
  *       400:
  *         description: Error en la solicitud
  *   delete:
  *     summary: Eliminar registro de trabajo
  *     tags:
  *       - Logs de Trabajo
  *     security:
  *       - bearerAuth: []
  *     parameters:
  *       - in: path
  *         name: id
  *         required: true
  *         schema:
  *           type: integer
  *     responses:
  *       200:
  *         description: Registro eliminado
  *       400:
  *         description: Error en la solicitud
  */
 router.put("/:id", authMiddleware, roleMiddleware("PRODUCCION"), validate({ params: idParamSchema, body: updateWorkLogSchema }), updateWorLog);
 router.get("/", authMiddleware, roleMiddleware("PRODUCCION"), getAllWorkLogs);
 router.delete("/:id", authMiddleware, roleMiddleware("PRODUCCION"), validate({ params: idParamSchema }), deleteWorkLog);

 export default router;
