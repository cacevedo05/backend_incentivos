export interface LiquidationDetailsModel {
  id: number
  liquidation_id: number
  employee_id: number
  module: string
  work_date: Date
  worked_minutes: number
  downtime_minutes: number
  produced_minutes: number
  efficiency: number
  incentive_base: number
  payment: number
  created_at: Date
}
