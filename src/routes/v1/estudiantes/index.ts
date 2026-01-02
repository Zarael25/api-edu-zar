import express, { Router } from 'express'
import passport from 'passport'
import { uploadExcel } from '../../../middlewares/uploadExcel'

import {
  crearEstudiante,
  getEstudiantes,
  getEstudianteById,
  importarEstudiantes
} from './controller'

import { authorizeRoles } from '../../../middlewares/authorizeRoles'

const estudiantes: Router = express.Router()

// 🔐 Todas las rutas protegidas
estudiantes.use(
  passport.authenticate('jwt', { session: false }),
  authorizeRoles('admin')
)

// ------------------ Listar estudiantes ------------------
estudiantes.get('/', getEstudiantes)

// ------------------ Crear estudiante ------------------
estudiantes.post('/', crearEstudiante)

// ------------------ Obtener estudiante por ID ------------------
estudiantes.get('/:id', getEstudianteById)


estudiantes.post(
  '/importar',
  uploadExcel.single('file'),
  importarEstudiantes
)


export default estudiantes
