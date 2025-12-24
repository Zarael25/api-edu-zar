import express from 'express'
import cors from 'cors'
import { errorHandler } from './middlewares/errorHandler'

const app = express()


app.use(cors())
app.use(express.json())

// Ruta raíz
app.get('/', (_req, res) => {
  res.json({
    message: 'API Edu.Zar funcionando'
  })
})


app.use(errorHandler)

export default app
