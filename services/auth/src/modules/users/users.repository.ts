import { pool } from '@incentivos/shared'
import { UserModel } from './users.model'

export class UserRepository {
  async create(data: any): Promise<UserModel> {
    const result = await pool.query(
      `INSERT INTO users (name, email, password, role, active)
       VALUES ($1, $2, $3, $4, true) RETURNING *`,
      [data.name, data.email, data.password, data.role]
    )
    return result.rows[0]
  }

  async findAll(): Promise<UserModel[]> {
    const result = await pool.query('SELECT * FROM users')
    return result.rows
  }

  async findById(id: number): Promise<UserModel | null> {
    const result = await pool.query(
      'SELECT * FROM users WHERE id = $1 AND active = true',
      [id]
    )
    return result.rows[0] || null
  }

  async update(id: number, data: any): Promise<UserModel> {
    const result = await pool.query(
      `UPDATE users SET name = $1, email = $2, role = $3 WHERE id = $4 RETURNING *`,
      [data.name, data.email, data.role, id]
    )
    return result.rows[0]
  }

  async updatePassword(id: number, password: string): Promise<void> {
    await pool.query('UPDATE users SET password = $1 WHERE id = $2', [password, id])
  }

  async delete(id: number): Promise<void> {
    await pool.query('UPDATE users SET active = false WHERE id = $1', [id])
  }

  async findByEmail(email: string): Promise<UserModel | null> {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email])
    return result.rows[0] || null
  }

  async activate(id: number): Promise<void> {
    await pool.query('UPDATE users SET active = true WHERE id = $1', [id])
  }
}
