import { Request, Response } from 'express'
import { WorkLogsService } from './work-logs.service'
import { WorkLogsRepository } from './work-logs.repository'

const service = new WorkLogsService(new WorkLogsRepository())

export const createWorkLog = async (req: Request, res: Response) => {
  try { const result = await service.create(req.body); res.json(result) }
  catch (error: any) { res.status(400).json({ message: error.message || 'Error al crear el registro de trabajo' }) }
}

export const updateWorLog = async (req: Request, res: Response) => {
  try { const result = await service.update(req.params.id, req.body); res.json(result) }
  catch (error: any) { res.status(400).json({ message: error.message || 'Error al actualizar el registro de trabajo' }) }
}

export const getAllWorkLogs = async (req: Request, res: Response) => {
  try { const result = await service.findAll(); res.json(result) }
  catch (error: any) { res.status(400).json({ message: error.message || 'Error al obtener los registros de trabajo' }) }
}

export const deleteWorkLog = async (req: Request, res: Response) => {
  try { const result = await service.delete(req.params.id); res.json(result) }
  catch (error: any) { res.status(400).json({ message: error.message || 'Error al eliminar el registro de trabajo' }) }
}
