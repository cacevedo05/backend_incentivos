import { Request, Response } from 'express'
import { ProductionService } from './production.service'
import { ProductionRepository } from './production.repository'

const service = new ProductionService(new ProductionRepository())

export const createProduction = async (req: Request, res: Response) => {
  try { const result = await service.create(req.body); res.status(201).json(result) }
  catch (error: any) { res.status(400).json({ message: error.message }) }
}

export const getAllProduction = async (_req: Request, res: Response) => {
  try { const result = await service.findAll(); res.json(result) }
  catch (error: any) { res.status(400).json({ message: error.message }) }
}

export const updateProduction = async (req: Request, res: Response) => {
  try { const { id } = req.params; const result = await service.update(id, req.body); res.json(result) }
  catch (error: any) { res.status(400).json({ message: error.message }) }
}

export const deleteProduction = async (req: Request, res: Response) => {
  try { const { id } = req.params; const result = await service.delete(id); res.json(result) }
  catch (error: any) { res.status(400).json({ message: error.message }) }
}
