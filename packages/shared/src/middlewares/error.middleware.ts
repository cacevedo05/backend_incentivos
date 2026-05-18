import { NextFunction, Request, Response } from 'express'

type HttpError = Error & {
  status?: number
  statusCode?: number
  type?: string
}

export const errorMiddleware = (
  error: HttpError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const status = error.status || error.statusCode || 500
  const message = error.message || 'La solicitud no pudo ser procesada'

  if (error instanceof SyntaxError && error.type === 'entity.parse.failed') {
    res.status(400).json({
      message: 'El cuerpo de la solicitud no tiene un JSON valido',
    })
    return
  }

  res.status(status).json({ message })
}
