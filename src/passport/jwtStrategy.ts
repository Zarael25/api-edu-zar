import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'

import UsuarioRepository from '../repositories/UsuarioRepository'
import { ApiError } from '../errors/ApiError'
import { env } from '../config/env'   // 👈 USAMOS ENV CENTRALIZADO

type DoneCallback = (error: any, user?: any, info?: any) => void

const jwtStrategy = new JwtStrategy(
  {
    // Extrae el token del header Authorization: Bearer <token>
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

    // 🔐 Secreto JWT desde config/env
    secretOrKey: env.authJwtSecret,
  },
  async (payload: any, done: DoneCallback) => {
    try {
      // 1. Obtener el ID del usuario (sub es estándar JWT)
      const userId = payload.sub ?? payload.id

      if (!userId) {
        return done(
          new ApiError('Token inválido: usuario no identificado.', 401),
          false,
        )
      }

      // 2. Buscar usuario en la BD
      const repository = new UsuarioRepository()
      const usuario = await repository.getById(userId)

      if (!usuario) {
        return done(
          new ApiError('Usuario no encontrado.', 401),
          false,
        )
      }

      // 3. Usuario válido → se adjunta a req.user
      return done(null, usuario)
    } catch (error) {
      return done(error, false)
    }
  },
)

export default jwtStrategy
