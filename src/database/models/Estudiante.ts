import { Schema, model, Document, Types } from 'mongoose'

/* =======================
   NIVELES EDUCATIVOS
======================= */
export const NIVELES = ['PM', 'PT', 'SM', 'ST'] as const

/* =======================
   ENTITY
======================= */
export type EstudianteEntity = {
  id?: string | any

  colegio: Types.ObjectId

  nombres: string
  apellidos: string
  password: string

  gestion: number
  curso: string
  nivel: string
  estado: string

  createdAt?: Date
  updatedAt?: Date
}

/* =======================
   DOCUMENT
======================= */
export interface EstudianteAttributes
  extends EstudianteEntity,
    Document {}

/* =======================
   SCHEMA
======================= */
const EstudianteSchema = new Schema<EstudianteAttributes>(
  {
    colegio: {
      type: Schema.Types.ObjectId,
      ref: 'Colegio',
      required: true,
    },

    nombres: {
      type: String,
      trim: true,
      uppercase: true,
      required: true,
    },

    apellidos: {
      type: String,
      trim: true,
      uppercase: true,
      required: true,
    },

    password: {
      type: String,
      required: true,
      select: false, // 🔐 no se devuelve por defecto
    },

    gestion: {
      type: Number,
      required: true,
    },

    curso: {
      type: String,
      trim: true,
      uppercase: true,
      required: true,
    },

    nivel: {
      type: String,
      enum: NIVELES,
      trim: true,
      uppercase: true,
      required: true,
    },

    estado: {
      type: String,
      enum: ['ACTIVO', 'RETIRADO'],
      trim: true,
      uppercase: true,
      default: 'ACTIVO',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
)

/* =======================
   ÍNDICES IMPORTANTES
======================= */
// Un estudiante no puede repetirse en la misma gestión
EstudianteSchema.index(
  { nombres: 1, apellidos: 1, colegio: 1, gestion: 1 },
  { unique: true },
)

/* =======================
   MODEL EXPORT
======================= */
export default model<EstudianteAttributes>(
  'Estudiante',
  EstudianteSchema,
)
