import express, { Router } from 'express'

import { authUsuario, getMe } from './controller'
import validateRequest from '../../../middlewares/validateRequest'
import { authSchema } from '../../../middlewares/requestSchemas'

const auth: Router = express.Router()

// ===============================
// LOGIN /auth/signin
// ===============================
// Valida carnet y password con Joi antes de pasar a Passport
auth.post('/signin', validateRequest(authSchema), authUsuario)

// ===============================
// PERFIL /auth/me
// ===============================
// Requiere JWT en el header Authorization: Bearer <token>
auth.get('/me', ...getMe)

export default auth
