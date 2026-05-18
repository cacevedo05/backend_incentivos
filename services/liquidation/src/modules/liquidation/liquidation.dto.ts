export interface CreateLiquidationDto {
  module: string
  start_date: Date
  end_date: Date
  created_user: string
}

export interface CreateLiquidationDetailsDto {
  liquidation_id: number
  employee_id: number
  module: string
  work_date: string
  worked_minutes: number
  downtime_minutes: number
  produced_minutes: number
  efficiency: number
  incentive_base: number
  payment: number
}
