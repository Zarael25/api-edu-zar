import express from 'express'
import cors from 'cors'
import passport from 'passport'

import v1Routes from './routes/v1'
import localStrategy from './passport/localStrategy'
import jwtStrategy from './passport/jwtStrategy'
import { errorHandler } from './middlewares/errorHandler'

const app = express()

// ===============================
// MIDDLEWARES GLOBALES
// ===============================
app.use(cors())
app.use(express.json())

// ===============================
// PASSPORT
// ===============================
passport.use(localStrategy)
passport.use(jwtStrategy)
app.use(passport.initialize())

// ===============================
// RUTAS
// ===============================
app.get('/', (_req, res) => {
  res.json({ message: 'API Edu.Zar funcionando' })
})

app.use('/api/v1', v1Routes)

// ===============================
// ERROR HANDLER
// ===============================
app.use(errorHandler)

export default app
