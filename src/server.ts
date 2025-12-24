import express from 'express'
import { env } from './config/env'
import { connectDB } from './database/connection'

const app = express()

app.use(express.json())

const startServer = async () => {
  await connectDB()

  app.listen(env.port, () => {
    console.log(`Servidor corriendo en http://localhost:${env.port}`)
  })
}

startServer()
