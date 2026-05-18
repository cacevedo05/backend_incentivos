export interface CreateProductionDTO {
  order_id: string
  units: number
}

export interface UpdateProductionDTO {
  units?: number
}

export interface CreateProductionFinishDTO {
  order_id: string
  reference_id: string
  units: number
  module: string
  standard_time: number
  total_time: number
}

export interface UpdateProductionFinishDTO {
  units?: number
  total_time?: number
}
