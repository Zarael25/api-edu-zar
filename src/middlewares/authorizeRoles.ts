import { Request, Response, NextFunction } from 'express'
import ApiError from '../errors/ApiError'

// ===============================
// AUTORIZACIÓN POR ROLES
// ===============================
// Uso:
// authorizeRoles('admin')
// authorizeRoles('admin', 'director')
// ===============================
export const authorizeRoles = (...rolesPermitidos: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const user = req.user

    if (!user) {
      return next(
        new ApiError({
          name: 'UNAUTHORIZED_ERROR',
          message: 'No autenticado',
          code: 'ERR_UNAUTH',
          status: 401,
        })
      )
    }

    const rolesUsuario = user.roles || []

    const tienePermiso = rolesUsuario.some(rol =>
      rolesPermitidos.includes(rol)
    )

    if (!tienePermiso) {
      return next(
        new ApiError({
          name: 'FORBIDDEN_ERROR',
          message: 'No tiene permisos para acceder a este recurso',
          code: 'ERR_FORB',
          status: 403,
        })
      )
    }

    next()
  }
}
