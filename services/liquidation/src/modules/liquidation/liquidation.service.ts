import { LiquidationRepository } from './liquidation.repository'
import { createServiceClient, withTransaction } from '@incentivos/shared'
import { CreateLiquidationDto, CreateLiquidationDetailsDto } from './liquidation.dto'
import { PoolClient } from 'pg'

const workLogsClient = createServiceClient('work-logs')
const productionClient = createServiceClient('production')

export class LiquidationService {
  constructor(private repo = new LiquidationRepository()) {}

  async create(data: CreateLiquidationDto) {
    return await withTransaction(async (client: PoolClient) => {
      const liquidation = await this.repo.createLiquidation(data, client)
      const rules = await this.repo.getAllIncentiveRules()

      const incentiveMap = new Map(
        rules.map((r) => [r.efficiency_point, Number(r.value)])
      )

      const workLogs = await workLogsClient.get<any[]>(
        `/api/work-logs?module=${data.module}&start_date=${String(data.start_date)}&end_date=${String(data.end_date)}`
      )

      const production = await productionClient.get<any[]>(
        `/api/production?module=${data.module}&start_date=${String(data.start_date)}&end_date=${String(data.end_date)}&summary=true`
      )

      const formatDate = (date: Date) =>
        new Date(date).toISOString().split('T')[0]

      const productionMap = new Map<string, number>()
      for (const p of production) {
        const key = formatDate(p.work_date)
        productionMap.set(key, Number(p.produced_minutes))
      }

      const workLogsByDate = new Map<string, any[]>()
      for (const w of (Array.isArray(workLogs) ? workLogs : [])) {
        const date = formatDate(w.work_date)
        if (!workLogsByDate.has(date)) workLogsByDate.set(date, [])
        workLogsByDate.get(date)!.push(w)
      }

      const details: CreateLiquidationDetailsDto[] = []

      for (const [date, logs] of workLogsByDate.entries()) {
        const produced = productionMap.get(date) || 0
        const totalWorked = logs.reduce((sum: number, l: any) => sum + l.minutes_worked, 0)
        const totalDowntime = logs.reduce((sum: number, l: any) => sum + l.minutes_downtime, 0)
        const totalEffective = totalWorked - totalDowntime

        let efficiency = 0
        if (totalEffective > 0) {
          efficiency = (produced / totalEffective) * 100
        }

        const effPoint = Math.min(Math.floor(efficiency), 105)
        const incentiveBase = incentiveMap.get(effPoint) || 0

        for (const w of logs) {
          const worked = w.minutes_worked
          const downtime = w.minutes_downtime
          const effectiveEmployee = worked - downtime
          const participation =
            totalEffective > 0 ? effectiveEmployee / totalEffective : 0
          const payment = incentiveBase * participation

          details.push({
            liquidation_id: liquidation.id,
            employee_id: w.employee_id,
            module: data.module,
            work_date: date,
            worked_minutes: worked,
            downtime_minutes: downtime,
            produced_minutes: produced,
            efficiency: Number(efficiency.toFixed(2)),
            incentive_base: incentiveBase,
            payment: Number(payment.toFixed(2)),
          })
        }
      }

      if (details.length > 0) {
        await this.repo.createManyLiquidationDetails(details, client)
      }

      return { liquidation, total_records: details.length }
    })
  }

  async findLiquidation() {
    return await this.repo.getAllLiquidation()
  }

  async findLiquidationDetails(id: number) {
    return await this.repo.getLiquidationDetailsById(id)
  }
}
