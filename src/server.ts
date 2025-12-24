import 'dotenv/config'           // 👈 ESTA LÍNEA ES CLAVE
import { env } from './config/env'
import { connectDB } from './database/connection'
import app from './app'

const startServer = async () => {
  await connectDB()

  app.listen(env.port, () => {
    console.log(`Servidor corriendo en http://localhost:${env.port}`)
  })
}

startServer()
