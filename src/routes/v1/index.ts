import express, { Router } from 'express'
import cors from 'cors'

import auth from './auth'

const v1: Router = express.Router()

// ===============================
// MIDDLEWARES GLOBALES v1
// ===============================
v1.use(cors())

// ===============================
// ROUTES v1
// ===============================
v1.use('/auth', auth)

export default v1
