import express, { Router } from 'express'
import passport from 'passport'

import { estructuraAcademica } from './controller'
import { authorizeRoles } from '../../../middlewares/authorizeRoles'

const academico: Router = express.Router()

// 🔐 Todas las rutas académicas requieren:
// - JWT válido
// - Rol admin o profesor
academico.use(
  passport.authenticate('jwt', { session: false }),
  authorizeRoles('admin', 'profesor')
)

// ------------------ Estructura académica ------------------
academico.get('/estructura', estructuraAcademica)

export default academico
