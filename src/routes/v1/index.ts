import express, { Router } from 'express'
import cors from 'cors'

import auth from './auth'
import colegios from './colegios'
import estudiantes from './estudiantes'
import academico from './academico'

const v1: Router = express.Router()


// ===============================
// ROUTES v1
// ===============================
v1.use('/auth', auth)
v1.use('/colegios', colegios)
v1.use('/estudiantes', estudiantes)   
v1.use('/academico', academico) 

export default v1
