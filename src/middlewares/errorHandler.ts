import { Request, Response, NextFunction } from 'express'
import { ValidationError } from 'joi'
import ApiError from '../errors/ApiError'

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  // 🔐 LOGIN: ocultar errores reales
  if (
    req.originalUrl.includes('/auth/signin') &&
    (err instanceof ValidationError || err instanceof ApiError)
  ) {
    return res.status(401).json({
      message: 'Usuario o contraseña incorrectos',
    })
  }

  // 📋 Validaciones Joi
  if (err instanceof ValidationError) {
    return res.status(400).json({
      message: err.details.map(d => d.message).join(', '),
    })
  }

  // ⚠️ Errores controlados (ApiError avanzado)
  if (err instanceof ApiError) {
    return res.status(err.status).json({
      message: err.message,
      code: err.code,
      name: err.name,
    })
  }

  console.error(err)

  return res.status(500).json({
    message: 'Error interno del servidor',
  })
}
