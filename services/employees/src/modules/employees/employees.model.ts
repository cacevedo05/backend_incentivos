export interface EmployeeModel {
  id: number
  document: string
  document_type?: string
  name: string
  address: string
  phone: string
  email: string
  module: string
  active: boolean
  created_at: Date
}
