import { Schema, model, Document, Types } from 'mongoose'

export const NIVELES = ['PM', 'PT', 'SM', 'ST'] as const

export type ColegioEntity = {
  id?: string | any

  usuarios: Types.ObjectId[]   // 👈 aquí el cambio clave
  nombre_colegio: string
  sigla?: string
  niveles: string[]
  ubicacion?: {
    departamento?: string
    provincia?: string
    ciudad?: string
  }
  estado: string

  createdAt?: Date
  updatedAt?: Date
}

export interface ColegioAttributes
  extends ColegioEntity,
    Document {}

const ColegioSchema = new Schema<ColegioAttributes>(
  {
    usuarios: {
      type: [Schema.Types.ObjectId],
      ref: 'Usuario',
      default: [],
    },

    nombre_colegio: {
      type: String,
      uppercase: true,
      trim: true,
      required: true,
    },


    sigla: {
      type: String,
      uppercase: true,
      trim: true,
      minlength: 2,
      maxlength: 10,
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

    ubicacion: {
      departamento: {
        type: String,
        uppercase: true,
        trim: true,
      },
      provincia: {
        type: String,
        uppercase: true,
        trim: true,
      },
      ciudad: {
        type: String,
        uppercase: true,
        trim: true,
      },
    },












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
