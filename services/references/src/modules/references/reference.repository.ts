import { pool } from '@incentivos/shared'
import { ReferencesModel } from './reference.model'

export class ReferencesRepository {
  async create(data: any): Promise<ReferencesModel> {
    const result = await pool.query(
      `INSERT INTO product_references (reference, color, size, standard_time, description)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [data.reference, data.color, data.size, data.standard_time, data.description]
    )
    return result.rows[0]
  }

  async findAll(): Promise<ReferencesModel[]> {
    const result = await pool.query('SELECT * FROM product_references WHERE active = true')
    return result.rows
  }

  async findById(id: string): Promise<ReferencesModel | null> {
    const result = await pool.query('SELECT * FROM product_references WHERE id = $1', [id])
    return result.rows[0] || null
  }

  async update(id: string, data: any): Promise<ReferencesModel> {
    const result = await pool.query(
      `UPDATE product_references SET standard_time = $1, description = $2 WHERE id = $3 RETURNING *`,
      [data.standard_time, data.description, id]
    )
    return result.rows[0]
  }

  async delete(id: string): Promise<void> {
    await pool.query('UPDATE product_references SET active = false WHERE id = $1', [id])
  }

  async activate(id: string): Promise<void> {
    await pool.query('UPDATE product_references SET active = true WHERE id = $1', [id])
  }

  async findByRefColSiz(reference: string, color: string, size: string): Promise<ReferencesModel | null> {
    const result = await pool.query(
      'SELECT * FROM product_references WHERE reference = $1 AND color = $2 AND size = $3',
      [reference, color, size]
    )
    return result.rows[0] || null
  }
}
