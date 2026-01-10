import { Schema, model, Document, Types } from 'mongoose'

/* =======================
   SUBDOCUMENTOS
======================= */
export type PracticaEntity = {
  nombre: string
  fecha: Date
  nota: number
}

export type ExamenEntity = {
  nombre: string
  fecha: Date
  nota: number
}

export type TrimestreEntity = {
  numero_trimestre: number
  practicas?: PracticaEntity[]
  examenes?: ExamenEntity[]
  nota_preliminar?: number
}

/* =======================
   ENTITY
======================= */
export type LibretaNotasEntity = {
  id?: string | any

  estudiante: Types.ObjectId
  materia: Types.ObjectId
  gestion: number

  trimestres?: TrimestreEntity[]

  createdAt?: Date
  updatedAt?: Date
}

/* =======================
   DOCUMENT
======================= */
export interface LibretaNotasAttributes
  extends LibretaNotasEntity,
    Document {}

/* =======================
   SCHEMAS EMBEBIDOS
======================= */
const PracticaSchema = new Schema<PracticaEntity>(
  {
    nombre: {
      type: String,
      uppercase: true,
      trim: true,
      required: true,
    },
    fecha: {
      type: Date,
      required: true,
    },
    nota: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },
  },
  { _id: false },
)

const ExamenSchema = new Schema<ExamenEntity>(
  {
    nombre: {
      type: String,
      uppercase: true,
      trim: true,
      required: true,
    },
    fecha: {
      type: Date,
      required: true,
    },
    nota: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },
  },
  { _id: false },
)

const TrimestreSchema = new Schema<TrimestreEntity>(
  {
    numero_trimestre: {
      type: Number,
      enum: [1, 2, 3],
      required: true,
    },
    practicas: {
      type: [PracticaSchema],
      default: [],
    },
    examenes: {
      type: [ExamenSchema],
      default: [],
    },
    nota_preliminar: {
      type: Number,
      min: 0,
      max: 100,
    },
  },
  { _id: false },
)

/* =======================
   SCHEMA PRINCIPAL
======================= */
const LibretaNotasSchema = new Schema<LibretaNotasAttributes>(
  {
    estudiante: {
      type: Schema.Types.ObjectId,
      ref: 'Estudiante',
      required: true,
    },

    materia: {
      type: Schema.Types.ObjectId,
      ref: 'Materia',
      required: true,
    },

    gestion: {
      type: Number,
      min: 2000,
      max: 2100,
      required: true,
    },

    trimestres: {
      type: [TrimestreSchema],
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
)


/* =======================
   ÍNDICES CLAVE
======================= */
// Una libreta por estudiante + materia + gestión
LibretaNotasSchema.index(
  { estudiante: 1, materia: 1, gestion: 1 },
  { unique: true }
)

/* =======================
   MODEL EXPORT
======================= */
export default model<LibretaNotasAttributes>(
  'LibretaNotas',
  LibretaNotasSchema,
)
