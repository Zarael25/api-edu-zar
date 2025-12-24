import 'dotenv/config'

const required = (key: string): string => {
  const value = process.env[key]
  if (!value) {
    throw new Error(`❌ Variable de entorno faltante: ${key}`)
  }
  return value
}

export const env = {
  port: Number(required('PORT')),
  mongoUri: required('MONGO_URI'),
  jwtSecret: required('JWT_SECRET'),
}
