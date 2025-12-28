import { Strategy } from 'passport-local'

import UsuarioRepository from '../repositories/UsuarioRepository'
import UsuarioResource from '../resources/UsuarioResource'
import ApiError from '../errors/ApiError'

const localStrategy = new Strategy(
  {
    usernameField: 'carnet',
    passwordField: 'password',
    session: false,
  },
  async (carnet: string, password: string, done) => {
    try {
      const repository = new UsuarioRepository()
      const usuarioFound = await repository.getAuthByCarnet(carnet)

      // 1. Validar existencia
      if (!usuarioFound || !usuarioFound.password) {
        throw new ApiError({
          name: 'UNAUTHORIZED_ERROR',
          message: 'Usuario o contraseña incorrectos.',
          code: 'ERR_UNAUTH',
          status: 401,
        })
      }

      // 2. Validar estado
      if (usuarioFound.estado !== 'ACTIVE') {
        throw new ApiError({
          name: 'FORBIDDEN_ERROR',
          message: 'Usuario inactivo o bloqueado.',
          code: 'ERR_FORB',
          status: 423,
        })
      }

      // 3. Validar roles permitidos
      const rolesPermitidos = ['admin', 'administracion', 'director', 'enfermeria','profesor']
      const tienePermiso = usuarioFound.roles?.some((rol: string) =>
        rolesPermitidos.includes(rol),
      )

      if (!tienePermiso) {
        throw new ApiError({
          name: 'FORBIDDEN_ERROR',
          message: 'Rol no autorizado para iniciar sesión.',
          code: 'ERR_FORB',
          status: 403,
        })
      }

      // 4. Validar contraseña
      const matchPassword = await repository.comparePassword(
        password,
        usuarioFound.password,
      )

      if (!matchPassword) {
        throw new ApiError({
          name: 'UNAUTHORIZED_ERROR',
          message: 'Usuario o contraseña incorrectos.',
          code: 'ERR_UNAUTH',
          status: 401,
        })
      }

      // 5. Usuario seguro
      const usuarioResource = new UsuarioResource(usuarioFound)
      return done(null, usuarioResource.item())
    } catch (error) {
      return done(error)
    }
  },
)

export default localStrategy
