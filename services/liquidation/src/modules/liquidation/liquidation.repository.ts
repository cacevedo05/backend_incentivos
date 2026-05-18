import { pool } from '@incentivos/shared'
import { LiquidationModel } from './liquidation.model'
import { LiquidationDetailsModel } from './liquidation_details.model'
import { IncentiveRulesModel } from './incentive_rules.model'
import { Pool, PoolClient } from 'pg'

type QueryClient = Pool | PoolClient

export class LiquidationRepository {
  async createLiquidation(data: any, client: QueryClient = pool): Promise<LiquidationModel> {
    const result = await client.query(
      `INSERT INTO liquidations (module, start_date, end_date, created_user)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [data.module, data.start_date, data.end_date, data.created_user]
    )
    return result.rows[0]
  }

  async createManyLiquidationDetails(details: any[], client: QueryClient = pool): Promise<void> {
    if (details.length === 0) return
    const values: any[] = []
    const placeholders = details
      .map((d, i) => {
        const idx = i * 10
        values.push(
          d.liquidation_id, d.employee_id, d.module, d.work_date,
          d.worked_minutes, d.downtime_minutes, d.produced_minutes,
          d.efficiency, d.incentive_base, d.payment
        )
        return `($${idx + 1}, $${idx + 2}, $${idx + 3}, $${idx + 4}, $${idx + 5}, $${idx + 6}, $${idx + 7}, $${idx + 8}, $${idx + 9}, $${idx + 10})`
      })
      .join(',')

    await client.query(
      `INSERT INTO liquidation_details (liquidation_id, employee_id, module, work_date, worked_minutes, downtime_minutes, produced_minutes, efficiency, incentive_base, payment)
       VALUES ${placeholders}`,
      values
    )
  }

  async getAllIncentiveRules(): Promise<IncentiveRulesModel[]> {
    const result = await pool.query('SELECT * FROM incentive_rules')
    return result.rows
  }

  async getAllLiquidation(): Promise<LiquidationModel[]> {
    const result = await pool.query('SELECT * FROM liquidations')
    return result.rows
  }

  async getLiquidationDetailsById(liquidation_id: number): Promise<LiquidationDetailsModel[]> {
    const result = await pool.query(
      'SELECT * FROM liquidation_details WHERE liquidation_id = $1',
      [liquidation_id]
    )
    return result.rows
  }
}
