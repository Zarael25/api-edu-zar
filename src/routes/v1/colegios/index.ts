import express, { Router } from 'express'
import passport from 'passport'

import {
  crearColegio,
  getMisColegios,
  getColegioById,
} from './controller'

import { authorizeRoles } from '../../../middlewares/authorizeRoles'

const colegios: Router = express.Router()

// 🔐 TODAS las rutas requieren:
// - JWT válido
// - Rol admin
colegios.use(
  passport.authenticate('jwt', { session: false }),
  authorizeRoles('admin')
)

// ------------------ Listar colegios ------------------
colegios.get('/', getMisColegios)

// ------------------ Crear colegio ------------------
colegios.post('/', crearColegio)

// ------------------ Obtener colegio por ID ------------------
colegios.get('/:id', getColegioById)

export default colegios
