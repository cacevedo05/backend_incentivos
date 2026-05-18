import { Request, Response, NextFunction } from 'express'

export const roleMiddleware = (...rolesAllowed: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user
    if (!user) {
      res.status(401).json({ message: 'No autorizado' })
      return
    }
    if (user.role === 'ADMIN') {
      next()
      return
    }
    if (!rolesAllowed.includes(user.role)) {
      res.status(403).json({ message: 'Acceso denegado' })
      return
    }
    next()
  }
}
