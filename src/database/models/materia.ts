import { Schema, model, Document, Types } from 'mongoose'

/* =======================
   ENTITY
======================= */
export type MateriaEntity = {
  id?: string | any

  colegio: Types.ObjectId
  nombre: string
  sigla: string
  nivel: string
  curso: string
  profesor: Types.ObjectId
  gestion: number
  estado: 'ACTIVO' | 'INACTIVO'

  createdAt?: Date
  updatedAt?: Date
}

/* =======================
   DOCUMENT
======================= */
export interface MateriaAttributes
  extends MateriaEntity,
    Document {}

/* =======================
   SCHEMA
======================= */
const MateriaSchema = new Schema<MateriaAttributes>(
  {
    colegio: {
      type: Schema.Types.ObjectId,
      ref: 'Colegio',
      required: true,
    },

    nombre: {
      type: String,
      uppercase: true,
      trim: true,
      required: true,
    },

    sigla: {
      type: String,
      uppercase: true,
      trim: true,
      required: true,
    },

    nivel: {
      type: String,
      uppercase: true,
      trim: true,
      required: true,
    },

    curso: {
      type: String,
      uppercase: true,
      trim: true,
      required: true,
    },

    profesor: {
      type: Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true,
    },

    gestion: {
      type: Number,
      min: 2000,
      max: 2100,
      required: true,
    },

    estado: {
      type: String,
      enum: ['ACTIVO', 'INACTIVO'],
      default: 'ACTIVO',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

/* =======================
   ÍNDICE ÚNICO
======================= */
MateriaSchema.index(
  { colegio: 1, nivel: 1, curso: 1, sigla: 1, gestion: 1 },
  { unique: true }
)

/* =======================
   MODEL EXPORT
======================= */
export default model<MateriaAttributes>('Materia', MateriaSchema)
