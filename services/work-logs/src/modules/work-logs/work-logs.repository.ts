import { pool } from '@incentivos/shared'
import { WorkLog } from './work-logs.model'

export class WorkLogsRepository {
  async create(data: any): Promise<WorkLog> {
    const result = await pool.query(
      `INSERT INTO work_logs (employee_id, module, work_date, minutes_worked, minutes_downtime)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [data.employee_id, data.module, data.work_date, data.minutes_worked, data.minutes_downtime]
    )
    return result.rows[0]
  }

  async findAll(): Promise<WorkLog[]> {
    const result = await pool.query('SELECT * FROM work_logs')
    return result.rows
  }

  async findById(id: string): Promise<WorkLog | null> {
    const result = await pool.query('SELECT * FROM work_logs WHERE id = $1', [id])
    return result.rows[0] || null
  }

  async findByEmployeeAndDate(employee_id: string, work_date: Date): Promise<WorkLog | null> {
    const result = await pool.query(
      'SELECT * FROM work_logs WHERE employee_id = $1 AND work_date = $2',
      [employee_id, work_date]
    )
    return result.rows[0] || null
  }

  async update(id: string, data: any): Promise<WorkLog | null> {
    const result = await pool.query(
      `UPDATE work_logs SET minutes_worked = $1, minutes_downtime = $2 WHERE id = $3 RETURNING *`,
      [data.minutes_worked, data.minutes_downtime, id]
    )
    return result.rows[0] || null
  }

  async delete(id: string): Promise<void> {
    await pool.query('DELETE FROM work_logs WHERE id = $1', [id])
  }

  async findByModuleAndDateRange(module: string, start: string, end: string): Promise<WorkLog[]> {
    const result = await pool.query(
      'SELECT * FROM work_logs WHERE module = $1 AND work_date BETWEEN $2 AND $3',
      [module, start, end]
    )
    return result.rows
  }
}
