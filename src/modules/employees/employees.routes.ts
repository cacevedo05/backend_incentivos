import { Router  } from "express";
import{
    createEmployees,
    getAllEmployees,
    updateEmployees,
    delteEmployees,
    activateEmployees
} from "./employees.controller";
import { authMiddleware } from "../../shared/middlewares/auth.middleware";
import { roleMiddleware } from "../../shared/middlewares/role.middleware";
import { validate } from "../../shared/middlewares/validate.middleware";
import { idParamSchema } from "../../shared/validations/common.schemas";
import { createEmployeesSchema, updateEmployeesSchema } from "./employees.schema";

const router = Router();

/**
 * @swagger
 * /api/employees:
 *   post:
 *     summary: Crear nuevo empleado
 *     tags:
 *       - Empleados
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - documentType
 *               - document
 *               - name
 *               - module
 *             properties:
 *               documentType:
 *                 type: string
 *               document:
 *                 type: string
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               module:
 *                 type: string
 *     responses:
 *       201:
 *         description: Empleado creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Employee'
 *       400:
 *         description: Error en la solicitud
 *   get:
 *     summary: Obtener todos los empleados
 *     tags:
 *       - Empleados
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de empleados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Employee'
 *       400:
 *         description: Error en la solicitud
 */
router.post("/", authMiddleware, roleMiddleware("RH"), validate({ body: createEmployeesSchema }), createEmployees);
router.get("/", authMiddleware, roleMiddleware("RH"), getAllEmployees);

/**
 * @swagger
 * /api/employees/{id}:
 *   put:
 *     summary: Actualizar empleado
 *     tags:
 *       - Empleados
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
 *               documentType:
 *                 type: string
 *               document:
 *                 type: string
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               module:
 *                 type: string
 *     responses:
 *       200:
 *         description: Empleado actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Employee'
 *       400:
 *         description: Error en la solicitud
 *   delete:
 *     summary: Eliminar empleado
 *     tags:
 *       - Empleados
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
 *         description: Empleado eliminado
 *       400:
 *         description: Error en la solicitud
 */
router.put("/:id", authMiddleware, roleMiddleware("RH"), validate({ params: idParamSchema, body: updateEmployeesSchema }), updateEmployees)
router.delete("/:id", authMiddleware, roleMiddleware("RH"), validate({ params: idParamSchema }), delteEmployees)

/**
 * @swagger
 * /api/employees/{id}/activate:
 *   put:
 *     summary: Activar empleado
 *     tags:
 *       - Empleados
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
 *         description: Empleado activado
 *       400:
 *         description: Error en la solicitud
 */
router.put("/:id/activate", authMiddleware, roleMiddleware("RH"), validate({ params: idParamSchema }), activateEmployees)

export default router;
