import express, { Router } from 'express'

import { authUsuario, getMe, logout } from './controller'
import validateRequest from '../../../middlewares/validateRequest'
import { authSchema } from '../../../middlewares/requestSchemas'

const auth: Router = express.Router()

// ===============================
// LOGIN /auth/signin
// ===============================
// Valida carnet y password con Joi antes de pasar a Passport
auth.post('/signin', validateRequest(authSchema), authUsuario)
auth.get('/me', ...getMe)
auth.post('/logout', logout)
export default auth
