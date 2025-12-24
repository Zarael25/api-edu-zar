import mongoose from 'mongoose'
import Debug from 'debug'
import { env } from '../config/env'

// Habilitar colores en debug
process.env.DEBUG_COLORS = 'true'

// Canales de log
const debug = Debug('app:database')
const dError = Debug('app:error')
dError.color = '1'

export const connectDB = async () => {
  try {
    console.log('🔗 Mongo URI:', env.mongoUri)

    await mongoose.connect(env.mongoUri, {
      autoIndex: true,
    })

    debug('✅ Conectado a MongoDB (base única)')
  } catch (error) {
    dError('❌ Error conectando a MongoDB:', error)
    process.exit(1)
  }
}
