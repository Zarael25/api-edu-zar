const required = (key: string): string => {
  const value = process.env[key]
  if (!value) {
    throw new Error(`❌ Variable de entorno faltante: ${key}`)
  }
  return value
}

export const env = {
  port: required('PORT'),
  mongoUri: required('MONGO_URI'),

  // 🔐 JWT (AUTH)
  authJwtSecret: required('AUTH_JWT_SECRET'),
  authJwtTime: required('AUTH_JWT_TIME'),
}
