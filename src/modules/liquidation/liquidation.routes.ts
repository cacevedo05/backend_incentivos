import { Router } from "express";
import {
    createLiquidation,
    getLiquidation,
    getLiquidationDetails
} from "./liquidation.controller";
import { authMiddleware } from "../../shared/middlewares/auth.middleware";
import { roleMiddleware } from "../../shared/middlewares/role.middleware";
import { validate } from "../../shared/middlewares/validate.middleware";
import { idParamSchema } from "../../shared/validations/common.schemas";
import { createLiquidationSchema } from "./liquidation.schema";

const router = Router()

/**
 * @swagger
 * /api/liquidation:
 *   post:
 *     summary: Crear liquidación de incentivos
 *     tags:
 *       - Liquidación
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - module
 *               - start_date
 *               - end_date
 *             properties:
 *               module:
 *                 type: string
 *               start_date:
 *                 type: string
 *                 format: date
 *               end_date:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Liquidación creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Liquidation'
 *       400:
 *         description: Error en la solicitud
 *   get:
 *     summary: Obtener todas las liquidaciones
 *     tags:
 *       - Liquidación
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de liquidaciones
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Liquidation'
 *       400:
 *         description: Error en la solicitud
 */
router.post("/", authMiddleware, roleMiddleware("PRODUCCION"), validate({ body: createLiquidationSchema }), createLiquidation)
router.get("/", authMiddleware, roleMiddleware("PRODUCCION"), getLiquidation)

/**
 * @swagger
 * /api/liquidation/{id}:
 *   get:
 *     summary: Obtener detalles de liquidación
 *     tags:
 *       - Liquidación
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
 *         description: Detalles de la liquidación
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LiquidationDetail'
 *       400:
 *         description: Error en la solicitud
 */
router.get("/:id", authMiddleware, roleMiddleware("PRODUCCION"), validate({ params: idParamSchema }), getLiquidationDetails)

export default router;
