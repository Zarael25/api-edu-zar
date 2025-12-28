const required = (key: string): string => {
  const value = process.env[key]
  if (!value) {
    throw new Error(`❌ Variable de entorno faltante: ${key}`)
  }
  return value
}

export const env = {
  // 🚀 SOLO necesario cuando levantas el servidor
  port: process.env.PORT,

  // 🗄️ Base de datos (SIEMPRE necesario)
  mongoUri: required('MONGO_URI'),

  // 🔐 JWT (AUTH)
  authJwtSecret: required('AUTH_JWT_SECRET'),
  authJwtTime: required('AUTH_JWT_TIME'),
}
