import { Schema, model, Document, Types } from 'mongoose'

export const NIVELES = ['PM', 'PT', 'SM', 'ST'] as const

export type ColegioEntity = {
  id?: string | any

  usuarios: Types.ObjectId[]   // 👈 aquí el cambio clave
  nombre_colegio: string
  niveles: string[]
  estado: string

  createdAt?: Date
  updatedAt?: Date
}

export interface ColegioAttributes
  extends ColegioEntity,
    Document {}

const ColegioSchema = new Schema<ColegioAttributes>(
  {
    usuarios: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true,
      },
    ],

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

export default model<ColegioAttributes>('Colegio', ColegioSchema)
