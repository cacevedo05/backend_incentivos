import { Router } from 'express'
import {
  createUser,
  getAllUsers,
  updateUser,
  deleteUser,
  changePassword,
  activeUser,
} from './users.controller'
import { authMiddleware, roleMiddleware, validate, idParamSchema } from '@incentivos/shared'
import { changePasswordSchema, createUserSchema, updateUserSchema } from './users.schema'

const router = Router()

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Crear nuevo usuario
 *     tags: [Usuarios]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, name, role]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *               name: { type: string }
 *               role: { type: string, enum: [ADMIN, PRODUCCION, RH] }
 *     responses:
 *       201:
 *         description: Usuario creado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/User' }
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Usuarios]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Lista de usuarios
 */
router.post('/', authMiddleware, roleMiddleware('ADMIN'), validate({ body: createUserSchema }), createUser)
router.get('/', authMiddleware, roleMiddleware('ADMIN'), getAllUsers)

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Actualizar usuario
 *     tags: [Usuarios]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path, name: id, required: true, schema: { type: integer }
 *     responses:
 *       200:
 *         description: Usuario actualizado
 *   delete:
 *     summary: Eliminar usuario
 *     tags: [Usuarios]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path, name: id, required: true, schema: { type: integer }
 *     responses:
 *       200:
 *         description: Usuario eliminado
 */
router.put('/:id', authMiddleware, roleMiddleware('ADMIN'), validate({ params: idParamSchema, body: updateUserSchema }), updateUser)
router.delete('/:id', authMiddleware, roleMiddleware('ADMIN'), validate({ params: idParamSchema }), deleteUser)

/**
 * @swagger
 * /api/users/{id}/password:
 *   put:
 *     summary: Cambiar contraseña
 *     tags: [Usuarios]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path, name: id, required: true, schema: { type: integer }
 *     responses:
 *       200:
 *         description: Contraseña cambiada
 * /api/users/{id}/activate:
 *   put:
 *     summary: Activar usuario
 *     tags: [Usuarios]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path, name: id, required: true, schema: { type: integer }
 *     responses:
 *       200:
 *         description: Usuario activado
 */
router.put('/:id/password', authMiddleware, roleMiddleware('ADMIN'), validate({ params: idParamSchema, body: changePasswordSchema }), changePassword)
router.put('/:id/activate', authMiddleware, roleMiddleware('ADMIN'), validate({ params: idParamSchema }), activeUser)

export default router
