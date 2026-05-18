export interface OrderModel {
  id: string
  reference_id: string
  quantity: number
  quantity_pending: number
  module: string
  status: string
  created_at: Date
}
