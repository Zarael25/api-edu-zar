import { Strategy } from 'passport-local'

import UsuarioRepository from '../repositories/UsuarioRepository'
import UsuarioResource from '../resources/UsuarioResource'
import { ApiError } from '../errors/ApiError'

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
        throw new ApiError('Usuario o contraseña incorrectos.', 401)
      }

      // 2. Validar estado
      if (usuarioFound.estado !== 'ACTIVE') {
        throw new ApiError('Usuario inactivo o bloqueado.', 423)
      }

      // 3. Validar roles permitidos
      const rolesPermitidos = ['admin', 'administracion', 'director', 'enfermeria']
      const tienePermiso = usuarioFound.roles?.some((rol: string) =>
        rolesPermitidos.includes(rol),
      )

      if (!tienePermiso) {
        throw new ApiError('Rol no autorizado para iniciar sesión.', 403)
      }

      // 4. Validar contraseña
      const matchPassword = await repository.comparePassword(
        password,
        usuarioFound.password,
      )

      if (!matchPassword) {
        throw new ApiError('Usuario o contraseña incorrectos.', 401)
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
