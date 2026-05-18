import { Router } from "express";
import {
    createReference,
    getAllReferences,
    updateReference,
    deleteReference,
    activeReference
} from "./reference.controller"
import { authMiddleware } from "../../shared/middlewares/auth.middleware";
import { roleMiddleware } from "../../shared/middlewares/role.middleware";
import { validate } from "../../shared/middlewares/validate.middleware";
import { idParamSchema } from "../../shared/validations/common.schemas";
import { createReferenceSchema, updateReferenceSchema } from "./reference.schema";


const router = Router()

/**
 * @swagger
 * /api/references:
 *   post:
 *     summary: Crear nueva referencia de producto
 *     tags:
 *       - Referencias
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reference
 *               - color
 *               - size
 *               - standard_time
 *             properties:
 *               reference:
 *                 type: string
 *               color:
 *                 type: string
 *               size:
 *                 type: string
 *               standard_time:
 *                 type: number
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Referencia creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductReference'
 *       400:
 *         description: Error en la solicitud
 *   get:
 *     summary: Obtener todas las referencias
 *     tags:
 *       - Referencias
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de referencias
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProductReference'
 *       400:
 *         description: Error en la solicitud
 */
router.post("/", authMiddleware, roleMiddleware("PRODUCCION"), validate({ body: createReferenceSchema }),createReference)
router.get("/", authMiddleware, roleMiddleware("PRODUCCION"), getAllReferences)

/**
 * @swagger
 * /api/references/{id}:
 *   put:
 *     summary: Actualizar referencia
 *     tags:
 *       - Referencias
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
 *               reference:
 *                 type: string
 *               color:
 *                 type: string
 *               size:
 *                 type: string
 *               standard_time:
 *                 type: number
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Referencia actualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductReference'
 *       400:
 *         description: Error en la solicitud
 *   delete:
 *     summary: Eliminar referencia
 *     tags:
 *       - Referencias
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
 *         description: Referencia eliminada
 *       400:
 *         description: Error en la solicitud
 */
router.put("/:id", authMiddleware, roleMiddleware("PRODUCCION"), validate({ params: idParamSchema, body: updateReferenceSchema }),updateReference)
router.delete("/:id", authMiddleware, roleMiddleware("PRODUCCION"), validate({ params: idParamSchema }),deleteReference)

/**
 * @swagger
 * /api/references/{id}/activate:
 *   put:
 *     summary: Activar referencia
 *     tags:
 *       - Referencias
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
 *         description: Referencia activada
 *       400:
 *         description: Error en la solicitud
 */
router.put("/:id/activate", authMiddleware, roleMiddleware("PRODUCCION"), validate({ params: idParamSchema }),activeReference)


export default router;
