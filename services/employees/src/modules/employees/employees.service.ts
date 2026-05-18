import { EmployeesRepository } from './employees.repository'
import { CreateEmployeesDTO, UpdateEmployeesDTO } from './employees.dto'

export class EmployeesService {
  constructor(private repo = new EmployeesRepository()) {}

  async create(data: CreateEmployeesDTO) {
    const existing = await this.repo.findByDocument(data.document)
    if (existing) {
      if (existing.active) throw new Error('Ya existe este documento')
      return { requiresActivation: true, message: 'El empleado existe pero está inactivo', employeeId: existing.id }
    }
    const employee = await this.repo.create(data)
    return {
      id: employee.id,
      documentType: employee.document_type,
      document: employee.document,
      name: employee.name,
      address: employee.address,
      phone: employee.phone,
      email: employee.email,
      module: employee.module,
    }
  }

  async findAll() { return await this.repo.findAll() }

  async update(id: number, data: UpdateEmployeesDTO) {
    const employee = await this.repo.findById(id)
    if (!employee) throw new Error('No se encontro el empleado')
    return this.repo.update(id, data)
  }

  async delete(id: number) {
    const employee = await this.repo.findById(id)
    if (!employee) throw new Error('No se encontro el empleado')
    await this.repo.delete(id)
    return { message: 'Empleado eliminado correctamente' }
  }

  async activate(id: number) {
    const employee = await this.repo.findByIdRaw(id)
    if (!employee) throw new Error('No se encontro el empleado')
    if (employee.active) throw new Error('El empleado ya esta activo')
    await this.repo.activate(id)
    return { message: 'Empleado activado correctamente' }
  }
}
