import { WorkLogsRepository } from './work-logs.repository'
import { createServiceClient } from '@incentivos/shared'
import { CreateWorkLogDto, UpdateWorkLogDto } from './work-logs.dto'

const employeesClient = createServiceClient('employees')

export class WorkLogsService {
  constructor(private repo = new WorkLogsRepository()) {}

  async create(data: CreateWorkLogDto) {
    const workLog = await this.repo.findByEmployeeAndDate(data.employee_id, data.work_date)
    if (workLog) throw new Error('Ya existe un registro para este empleado en esta fecha')

    const employee = await employeesClient.get(`/api/employees?id=${data.employee_id}`)
    const empData = Array.isArray(employee) ? employee.find((e: any) => e.id === Number(data.employee_id)) : employee
    if (!empData) throw new Error('El empleado no existe')
    if (empData.module !== data.module) throw new Error(`El empleado no pertenece al modulo ${data.module}`)

    if (data.minutes_downtime > data.minutes_worked) {
      throw new Error('Los minutos improductivos no pueden ser mayores a los trabajados')
    }

    const newWorkLog = await this.repo.create(data)
    return {
      id: newWorkLog.id,
      employee_id: newWorkLog.employee_id,
      module: newWorkLog.module,
      work_date: newWorkLog.work_date,
      minutes_worked: newWorkLog.minutes_worked,
      minutes_downtime: newWorkLog.minutes_downtime,
    }
  }

  async update(id: string, data: UpdateWorkLogDto) {
    const workLog = await this.repo.findById(id)
    if (!workLog) throw new Error('No se encontro el registro de trabajo')
    if (data.minutes_worked === undefined || data.minutes_downtime === undefined) {
      throw new Error('Los minutos trabajados e improductivos son obligatorios')
    }
    if (data.minutes_downtime > data.minutes_worked) {
      throw new Error('Los minutos improductivos no pueden ser mayores a los trabajados')
    }
    return await this.repo.update(id, data)
  }

  async findAll() { return await this.repo.findAll() }

  async delete(id: string) {
    const workLog = await this.repo.findById(id)
    if (!workLog) throw new Error('No se encontro el registro de trabajo')
    await this.repo.delete(id)
    return { message: 'Registro de trabajo eliminado correctamente' }
  }
}
