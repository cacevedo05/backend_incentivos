import { pool } from '@incentivos/shared'
import { UserModel } from './auth.model'

export class AuthRepository {
  async findByEmail(email: string): Promise<UserModel | null> {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    )
    return result.rows[0] || null
  }
}
