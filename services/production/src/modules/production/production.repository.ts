import { pool } from '@incentivos/shared'
import { ProductionModel } from './production.model'

export class ProductionRepository {
  async create(data: any): Promise<ProductionModel> {
    const result = await pool.query(
      `INSERT INTO production_records (order_id, reference_id, module, units, standard_time, total_time)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [data.order_id, data.reference_id, data.module, data.units, data.standard_time, data.total_time]
    )
    return result.rows[0]
  }

  async findAll(): Promise<ProductionModel[]> {
    const result = await pool.query('SELECT * FROM production_records')
    return result.rows
  }

  async findById(id: string): Promise<ProductionModel | null> {
    const result = await pool.query('SELECT * FROM production_records WHERE id = $1', [id])
    return result.rows[0] || null
  }

  async update(id: string, data: any): Promise<ProductionModel> {
    const result = await pool.query(
      `UPDATE production_records SET units = $1, total_time = $2 WHERE id = $3 RETURNING *`,
      [data.units, data.total_time, id]
    )
    return result.rows[0]
  }

  async delete(id: string): Promise<void> {
    await pool.query('DELETE FROM production_records WHERE id = $1', [id])
  }

  async lastProductionByOrderId(order_id: string): Promise<ProductionModel | null> {
    const result = await pool.query(
      'SELECT * FROM production_records WHERE order_id = $1 ORDER BY created_at DESC LIMIT 1',
      [order_id]
    )
    return result.rows[0] || null
  }

  async findByOrderId(order_id: string): Promise<ProductionModel[]> {
    const result = await pool.query('SELECT * FROM production_records WHERE order_id = $1', [order_id])
    return result.rows
  }

  async getSummaryByModuleAndDateRange(module: string, start: string, end: string) {
    const result = await pool.query(
      `SELECT DATE(created_at) as work_date, SUM(total_time) as produced_minutes
       FROM production_records
       WHERE module = $1 AND DATE(created_at) BETWEEN $2 AND $3
       GROUP BY DATE(created_at)`,
      [module, start, end]
    )
    return result.rows
  }

  async updateOrderPending(orderId: string, quantity_pending: number): Promise<void> {
    const status = quantity_pending === 0 ? 'CERRADA' : 'ABIERTA'
    await pool.query(
      `UPDATE production_orders SET quantity_pending = $1, status = $2 WHERE id = $3`,
      [quantity_pending, status, orderId]
    )
  }
}
