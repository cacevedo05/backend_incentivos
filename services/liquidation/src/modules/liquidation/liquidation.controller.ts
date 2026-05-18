import { Request, Response } from 'express'
import { LiquidationService } from './liquidation.service'
import { LiquidationRepository } from './liquidation.repository'

const service = new LiquidationService(new LiquidationRepository())

export const createLiquidation = async (req: Request, res: Response) => {
  try {
    const data = {
      ...req.body,
      created_user: req.body.created_user ?? String((req as any).user?.id),
    }
    const result = await service.create(data)
    res.status(201).json(result)
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}

export const getLiquidation = async (req: Request, res: Response) => {
  try {
    const result = await service.findLiquidation()
    res.json(result)
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}

export const getLiquidationDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const result = await service.findLiquidationDetails(Number(id))
    res.json(result)
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}
