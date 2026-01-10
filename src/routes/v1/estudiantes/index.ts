import express, { Router } from 'express'
import passport from 'passport'
import { uploadExcel } from '../../../middlewares/uploadExcel'

import {
  crearEstudiante,
  getEstudiantes,
  getEstudianteById,
  importarEstudiantes,
  getCursosByColegio,
} from './controller'

import { authorizeRoles } from '../../../middlewares/authorizeRoles'

const estudiantes: Router = express.Router()

// 🔐 Todas las rutas protegidas
estudiantes.use(
  passport.authenticate('jwt', { session: false }),
  authorizeRoles('admin')
)


// ------------------ Cursos por colegio y nivel ------------------
// GET /v1/estudiantes/cursos?colegio=ID&nivel=SM
estudiantes.get('/cursos', getCursosByColegio)


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
