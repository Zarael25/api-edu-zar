import 'dotenv/config'           // 👈 carga .env
import { env } from './config/env'
import { connectDB } from './database/connection'
import app from './app'

const startServer = async () => {
  await connectDB()

  const PORT = env.port || 3000   // 👈 fallback seguro

  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
  })
}

startServer()
