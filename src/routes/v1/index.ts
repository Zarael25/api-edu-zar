import express, { Router } from 'express'
import cors from 'cors'

import auth from './auth'
import colegios from './colegios'
const v1: Router = express.Router()


// ===============================
// ROUTES v1
// ===============================
v1.use('/auth', auth)
v1.use('/colegios', colegios)

export default v1
