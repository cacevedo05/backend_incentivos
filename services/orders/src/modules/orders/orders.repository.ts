import { pool } from '@incentivos/shared'
import { OrderModel } from './orders.model'

export class OrdersRepository {
  async create(data: any): Promise<OrderModel> {
    const result = await pool.query(
      `INSERT INTO production_orders (reference_id, quantity, quantity_pending, module)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [data.reference_id, data.quantity, data.quantity_pending, data.module]
    )
    return result.rows[0]
  }

  async findAll(): Promise<OrderModel[]> {
    const result = await pool.query('SELECT * FROM production_orders ORDER BY created_at DESC')
    return result.rows
  }

  async findById(id: string): Promise<OrderModel | null> {
    const result = await pool.query('SELECT * FROM production_orders WHERE id = $1', [id])
    return result.rows[0] || null
  }

  async update(id: string, data: any): Promise<OrderModel> {
    const result = await pool.query(
      `UPDATE production_orders SET quantity = $1, module = $2, status = $3 WHERE id = $4 RETURNING *`,
      [data.quantity, data.module, data.status, id]
    )
    return result.rows[0]
  }

  async delete(id: string): Promise<void> {
    await pool.query("UPDATE production_orders SET status = 'CANCELADA' WHERE id = $1", [id])
  }

  async modules(): Promise<string[]> {
    const result = await pool.query('SELECT DISTINCT module FROM employees')
    return result.rows.map((row: any) => row.module)
  }

  async updatePendingAndStatus(id: string, quantity_pending: number): Promise<void> {
    const status = quantity_pending === 0 ? 'CERRADA' : 'ABIERTA'
    await pool.query(
      `UPDATE production_orders SET quantity_pending = $1, status = $2 WHERE id = $3`,
      [quantity_pending, status, id]
    )
  }

  async findByReferenceId(reference_id: string): Promise<OrderModel[]> {
    const result = await pool.query(
      `SELECT * FROM production_orders WHERE reference_id = $1 AND status = 'ABIERTA'`,
      [reference_id]
    )
    return result.rows
  }
}
