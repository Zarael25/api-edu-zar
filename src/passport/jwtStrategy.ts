import { Strategy as JwtStrategy } from 'passport-jwt'

import UsuarioRepository from '../repositories/UsuarioRepository'
import { ApiError } from '../errors/ApiError'
import { env } from '../config/env'

type DoneCallback = (error: any, user?: any, info?: any) => void

const cookieExtractor = (req: any) => {
  if (req && req.cookies) {
    return req.cookies.token
  }
  return null
}

const jwtStrategy = new JwtStrategy(
  {
    jwtFromRequest: cookieExtractor, // 👈 CLAVE
    secretOrKey: env.authJwtSecret,
  },
  async (payload: any, done: DoneCallback) => {
    try {
      const userId = payload.sub ?? payload.id

      if (!userId) {
        return done(
          new ApiError('Token inválido: usuario no identificado.', 401),
          false,
        )
      }

      const repository = new UsuarioRepository()
      const usuario = await repository.getById(userId)

      if (!usuario) {
        return done(
          new ApiError('Usuario no encontrado.', 401),
          false,
        )
      }

      return done(null, usuario)
    } catch (error) {
      return done(error, false)
    }
  },
)

export default jwtStrategy
