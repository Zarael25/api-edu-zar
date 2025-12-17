import { Request, Response, NextFunction } from 'express'
import { ApiError } from '../errors/ApiError'

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  // Errores controlados de la aplicación
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      message: err.message
    })
  }

  // Log para desarrollo
  console.error(err)

  // Error genérico
  return res.status(500).json({
    message: 'Error interno del servidor'
  })
}
