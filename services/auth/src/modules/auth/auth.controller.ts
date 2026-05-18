import { Request, Response } from 'express'
import { AuthService } from './auth.service'
import { AuthRepository } from './auth.repository'

const service = new AuthService(new AuthRepository())

export const login = async (req: Request, res: Response) => {
  try {
    const result = await service.login(req.body)
    res.json(result)
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Error en el login' })
  }
}
