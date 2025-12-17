import 'dotenv/config'

export const env = {
  port: Number(process.env.PORT) || 3000,
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/edu-zar',
  jwtSecret: process.env.JWT_SECRET || 'dev-secret'
}
