import { Schema, model, Document, Types } from 'mongoose'

/* =======================
   NIVELES EDUCATIVOS
======================= */
export const NIVELES = ['PM', 'PT', 'SM', 'ST'] as const

/* =======================
   ENTITY
======================= */
export type ColegioEntity = {
  id?: string | any

  user: Types.ObjectId
  nombre_colegio: string
  niveles: string[]
  estado: string

  createdAt?: Date
  updatedAt?: Date
}

/* =======================
   DOCUMENT
======================= */
export interface ColegioAttributes
  extends ColegioEntity,
    Document {}

/* =======================
   SCHEMA
======================= */
const ColegioSchema = new Schema<ColegioAttributes>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true,
    },

    nombre_colegio: {
      type: String,
      uppercase: true,
      trim: true,
      required: true,
    },

    niveles: [
      {
        type: String,
        enum: NIVELES,
        uppercase: true,
        trim: true,
        required: true,
      },
    ],

    estado: {
      type: String,
      enum: ['ACTIVO', 'INACTIVO'],
      uppercase: true,
      trim: true,
      default: 'ACTIVO',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
)

/* =======================
   MODEL EXPORT
======================= */
export default model<ColegioAttributes>('Colegio', ColegioSchema)
