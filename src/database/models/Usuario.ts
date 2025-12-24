import { Schema, Document, model } from 'mongoose'

/* =======================
   ROLES DEL SISTEMA
======================= */
export const ROLES = [
  'admin',
  'administracion',
  'contabilidad',
  'director',
  'secretaria',
  'profesor',
  'regencia',
  'inscriptor',
  'enfermeria',
  'psicologia',
  'informaciones',
  'estudiante',
] as const

/* =======================
   ENTITY
======================= */
export type UsuarioEntity = {
  id?: string | any

  email: string
  password?: string

  nombre: string
  appaterno: string
  apmaterno: string

  carnet: string
  complemento: string
  expedido: string

  fechaNacimiento: Date
  avatar?: string
  genero: string
  celular?: string

  estado: string
  roles: string[]
  niveles: string[]

  createdAt?: Date
  updatedAt?: Date
}

/* =======================
   DOCUMENT
======================= */
export interface UsuarioAttributes
  extends UsuarioEntity,
    Document {}

/* =======================
   SCHEMA
======================= */
const UsuarioSchema = new Schema<UsuarioAttributes>(
  {
    email: {
      type: String,
      lowercase: true,
      trim: true,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      trim: true,
      required: true,
      select: false, // 🔐 no devolver en queries
    },

    nombre: {
      type: String,
      uppercase: true,
      trim: true,
      required: true,
    },

    appaterno: {
      type: String,
      uppercase: true,
      trim: true,
      required: true,
    },

    apmaterno: {
      type: String,
      uppercase: true,
      trim: true,
      required: true,
    },

    carnet: {
      type: String,
      uppercase: true,
      trim: true,
      required: true,
    },

    complemento: {
      type: String,
      uppercase: true,
      trim: true,
      default: '',
    },

    expedido: {
      type: String,
      enum: ['CH', 'TJ', 'PT', 'LP', 'OR', 'CB', 'SC', 'BN', 'PA'],
      uppercase: true,
      required: true,
    },

    fechaNacimiento: {
      type: Date,
      required: true,
    },

    avatar: {
      type: String,
      trim: true,
    },

    genero: {
      type: String,
      enum: ['FEMENINO', 'MASCULINO'],
      uppercase: true,
      trim: true,
      required: true,
    },

    celular: {
      type: String,
      trim: true,
    },

    estado: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE'],
      uppercase: true,
      trim: true,
      default: 'ACTIVE',
    },

    roles: [
      {
        type: String,
        enum: ROLES,
        trim: true,
        required: true,
      },
    ],

    niveles: [
      {
        type: String,
        enum: ['PM', 'PT', 'SM', 'ST'],
        uppercase: true,
        trim: true,
        required: true,
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  },
)

/* =======================
   MODEL EXPORT
======================= */
const Usuario = model<UsuarioAttributes>('Usuario', UsuarioSchema)

export default Usuario
