import { Request, Response, NextFunction } from 'express'
import passport from 'passport'
import jwt from 'jsonwebtoken'

import UsuarioResource from '../../../resources/UsuarioResource'
import { ApiError } from '../../../errors/ApiError'
import { env } from '../../../config/env'   // 👈 CLAVE

// ===============================
// LOGIN /auth/signin
// ===============================
export const authUsuario = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  passport.authenticate(
    'local',
    { session: false },
    async (error: any, usuario: any) => {
      if (error) return next(error)

      try {
        if (!usuario) {
          throw new ApiError('Usuario o contraseña incorrectos.', 401)
        }

        // ===============================
        // Payload JWT
        // ===============================
        const payload = {
          sub: usuario.id,
          roles: usuario.roles,
        }

        // ===============================
        // Firmar token usando config/env
        // ===============================
        const token = jwt.sign(
        payload,
        env.authJwtSecret as jwt.Secret,
        {
            expiresIn: env.authJwtTime as jwt.SignOptions['expiresIn'],
        },
        )

        // ===============================
        // 🍪 Guardar token en cookie HttpOnly
        // ===============================
        res.cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 1000, // 1 hora
        })

        // ===============================
        // Respuesta (NO enviar token)
        // ===============================
        return res.status(200).json({
          message: 'signin successfully',
          usuario,
        })




        
      } catch (err) {
        return next(err)
      }
    },
  )(req, res, next)
}

// ===============================
// PERFIL /auth/me
// ===============================
export const getMe = [
  passport.authenticate('jwt', { session: false }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new ApiError('No autenticado.', 401)
      }

      const usuarioResource = new UsuarioResource(req.user as any)

      return res.json({
        usuario: usuarioResource.item(),
      })
    } catch (err) {
      next(err)
    }
  },
]


// ===============================
// LOGOUT /auth/logout
// ===============================
export const logout = (
  req: Request,
  res: Response,
) => {
  // 🍪 Eliminar cookie del token
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  })

  return res.status(200).json({
    message: 'logout successfully',
  })
}
