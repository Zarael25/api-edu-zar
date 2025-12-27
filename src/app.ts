import express from 'express'
import cors from 'cors'
import passport from 'passport'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'

import v1Routes from './routes/v1'
import localStrategy from './passport/localStrategy'
import jwtStrategy from './passport/jwtStrategy'
import { errorHandler } from './middlewares/errorHandler'

const app = express()

// ===============================
// MIDDLEWARES GLOBALES
// ===============================
app.use(
  cors({
    origin: 'http://localhost:4000', 
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],               
  })
)

app.use(cookieParser())          
app.use(express.json())
app.use(morgan('dev'))

// ===============================
// PASSPORT
// ===============================
app.use(passport.initialize())
passport.use(localStrategy)
passport.use(jwtStrategy)

// ===============================
// RUTAS
// ===============================
app.get('/', (_req, res) => {
  res.json({ message: 'API Edu.Zar funcionando' })
})

app.use('/v1', v1Routes)

// ===============================
// ERROR HANDLER
// ===============================
app.use(errorHandler)

export default app
