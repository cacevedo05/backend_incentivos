export interface CreateWorkLogDto {
  employee_id: string
  module: string
  work_date: Date
  minutes_worked: number
  minutes_downtime: number
}

export interface UpdateWorkLogDto {
  minutes_worked?: number
  minutes_downtime?: number
}
