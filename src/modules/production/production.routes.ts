import { Router } from "express";
import {
    createProduction,
    getAllProduction,
    updateProduction,
    deleteProduction
} from "./production.controller";
import { authMiddleware } from "../../shared/middlewares/auth.middleware";
import { roleMiddleware } from "../../shared/middlewares/role.middleware";
import { validate } from "../../shared/middlewares/validate.middleware";
import { idParamSchema } from "../../shared/validations/common.schemas";
import { createProductionSchema, updateProductionSchema } from "./production.schema";

const router = Router()

/**
 * @swagger
 * /api/production:
 *   post:
 *     summary: Crear registro de producción
 *     tags:
 *       - Producción
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProductionProcess'
 *     responses:
 *       201:
 *         description: Registro creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductionRecord'
 *       400:
 *         description: Error en la solicitud
 *   get:
 *     summary: Obtener registros de producción
 *     tags:
 *       - Producción
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de registros de producción
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProductionRecord'
 *       400:
 *         description: Error en la solicitud
 */
router.post("/", authMiddleware, roleMiddleware("PRODUCCION"), validate({ body: createProductionSchema }),createProduction)
router.get("/", authMiddleware, roleMiddleware("PRODUCCION"), getAllProduction)

/**
 * @swagger
 * /api/production/{id}:
 *   put:
 *     summary: Actualizar registro de producción
 *     tags:
 *       - Producción
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
 *             $ref: '#/components/schemas/UpdateProductionProcess'
 *     responses:
 *       200:
 *         description: Registro actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductionRecord'
 *       400:
 *         description: Error en la solicitud
 *   delete:
 *     summary: Eliminar registro de producción
 *     tags:
 *       - Producción
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
router.put("/:id", authMiddleware, roleMiddleware("PRODUCCION"), validate({ params: idParamSchema, body: updateProductionSchema }), updateProduction)
router.delete("/:id", authMiddleware, roleMiddleware("PRODUCCION"), validate({ params: idParamSchema }), deleteProduction)

export default router;
