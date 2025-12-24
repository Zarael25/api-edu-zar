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

  user: Types.ObjectId
  colegio: Types.ObjectId

  gestion: number
  curso: string
  nivel: string
  estado: string
  numero_lista: number

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
    user: {
      type: Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true,
    },

    colegio: {
      type: Schema.Types.ObjectId,
      ref: 'Colegio',
      required: true,
    },

    gestion: {
      type: Number,
      required: true,
    },

    curso: {
      type: String,
      uppercase: true,
      trim: true,
      required: true,
    },

    nivel: {
      type: String,
      enum: NIVELES,
      uppercase: true,
      trim: true,
      required: true,
    },

    estado: {
      type: String,
      enum: ['ACTIVO', 'RETIRADO'],
      uppercase: true,
      trim: true,
      default: 'ACTIVO',
    },

    numero_lista: {
      type: Number,
      min: 1,
      required: true,
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
  { user: 1, colegio: 1, gestion: 1 },
  { unique: true },
)

/* =======================
   MODEL EXPORT
======================= */
export default model<EstudianteAttributes>(
  'Estudiante',
  EstudianteSchema,
)
