import bcrypt from 'bcryptjs'
import { UserRepository } from './users.repository'
import { CreateUserDTO, UpdateUserDTO, ChangePasswordDTO } from './users.dto'
import { pool } from '@incentivos/shared'

export class UserService {
  constructor(private repo: UserRepository) {}

  async create(data: CreateUserDTO) {
    const existing = await this.repo.findByEmail(data.email)
    if (existing) {
      if (existing.active) {
        throw new Error('Ya existe este correo')
      }
      return {
        requiresActivation: true,
        message: 'El usuario existe pero está inactivo',
        userId: existing.id,
      }
    }
    const hashedPassword = await bcrypt.hash(data.password, 10)
    const user = await this.repo.create({ ...data, password: hashedPassword })
    return { id: user.id, name: user.name, email: user.email, role: user.role }
  }

  async findAll() {
    return await this.repo.findAll()
  }

  async update(id: number, data: UpdateUserDTO) {
    const user = await this.repo.findById(id)
    if (!user) throw new Error('Usuario no encontrado')
    return this.repo.update(id, data)
  }

  async delete(id: number) {
    const user = await this.repo.findById(id)
    if (!user) throw new Error('Usuario no encontrado')
    await this.repo.delete(id)
    return { message: 'Usuario desactivado correctamente' }
  }

  async changePassword(id: number, data: ChangePasswordDTO) {
    const user = await this.repo.findById(id)
    if (!user) throw new Error('Usuario no encontrado')
    const isValid = await bcrypt.compare(data.currentPassword, user.password)
    if (!isValid) throw new Error('Contraseña actual incorrecta')
    const hashedPassword = await bcrypt.hash(data.newPassword, 10)
    await this.repo.updatePassword(id, hashedPassword)
    return { message: 'Contraseña actualizada correctamente' }
  }

  async active(id: number) {
    const user = await pool.query('SELECT * FROM users WHERE id = $1', [id])
    if (!user.rows[0]) throw new Error('Usuario no encontrado')
    if (user.rows[0].active) throw new Error('El usuario ya esta activo')
    await this.repo.activate(id)
    return { message: 'Usuario activado correctamente' }
  }
}
