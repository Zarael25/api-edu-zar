import { Request, Response, NextFunction } from 'express'
import { Types } from 'mongoose'
import bcrypt from 'bcryptjs'

import Estudiante from '../../../database/models/Estudiante'
import Colegio from '../../../database/models/Colegio'
import ApiError from '../../../errors/ApiError'

import XLSX from 'xlsx'








/* ======================================================
   CREAR ESTUDIANTE
   POST /v1/estudiantes
   - Requiere JWT
   - Rol admin
====================================================== */
export const crearEstudiante = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      colegio,
      nombres,
      apellidos,
      password,
      gestion,
      curso,
      nivel,
    } = req.body

    // ---------------- VALIDACIÓN BÁSICA ----------------
    if (
      !colegio ||
      !nombres ||
      !apellidos ||
      !password ||
      !gestion ||
      !curso ||
      !nivel
    ) {
      throw new ApiError({
        name: 'VALIDATION_ERROR',
        message: 'Datos incompletos',
        code: 'ERR_VALID',
        status: 400,
      })
    }

    // ---------------- VALIDAR COLEGIO ----------------
    if (!Types.ObjectId.isValid(colegio)) {
      throw new ApiError({
        name: 'VALIDATION_ERROR',
        message: 'ID de colegio inválido',
        code: 'ERR_VALID',
        status: 400,
      })
    }

    const existeColegio = await Colegio.findById(colegio)
    if (!existeColegio) {
      throw new ApiError({
        name: 'NOT_FOUND_ERROR',
        message: 'Colegio no encontrado',
        code: 'ERR_NF',
        status: 404,
      })
    }

    // ---------------- EVITAR DUPLICADOS ----------------
    const existeEstudiante = await Estudiante.findOne({
      nombres: nombres.toUpperCase(),
      apellidos: apellidos.toUpperCase(),
      colegio,
      gestion,
    })

    if (existeEstudiante) {
      throw new ApiError({
        name: 'CONFLICT_ERROR',
        message: 'El estudiante ya existe en esta gestión',
        code: 'ERR_CONFLICT',
        status: 409,
      })
    }

    // ---------------- HASH PASSWORD ----------------
    const passwordHash = await bcrypt.hash(password, 10)

    // ---------------- CREAR ESTUDIANTE ----------------
    const estudiante = await Estudiante.create({
      colegio,
      nombres,
      apellidos,
      password: passwordHash,
      gestion,
      curso,
      nivel,
    })

    return res.status(201).json(estudiante)
  } catch (err) {
    next(err)
  }
}

/* ======================================================
   LISTAR ESTUDIANTES
   GET /v1/estudiantes
   - Opcional: ?colegio=ID
====================================================== */
export const getEstudiantes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { colegio } = req.query

    const filter: any = { estado: 'ACTIVO' }

    if (colegio) {
      if (!Types.ObjectId.isValid(colegio as string)) {
        throw new ApiError({
          name: 'VALIDATION_ERROR',
          message: 'ID de colegio inválido',
          code: 'ERR_VALID',
          status: 400,
        })
      }

      filter.colegio = colegio
    }

    const estudiantes = await Estudiante.find(filter)
      .populate('colegio', 'nombre_colegio')
      .lean()

    return res.json({
      count: estudiantes.length,
      data: estudiantes,
    })
  } catch (err) {
    next(err)
  }
}

/* ======================================================
   OBTENER ESTUDIANTE POR ID
   GET /v1/estudiantes/:id
====================================================== */
export const getEstudianteById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params

    if (!Types.ObjectId.isValid(id)) {
      throw new ApiError({
        name: 'VALIDATION_ERROR',
        message: 'ID de estudiante inválido',
        code: 'ERR_VALID',
        status: 400,
      })
    }

    const estudiante = await Estudiante.findById(id)
      .populate('colegio', 'nombre_colegio')
      .lean()

    if (!estudiante) {
      throw new ApiError({
        name: 'NOT_FOUND_ERROR',
        message: 'Estudiante no encontrado',
        code: 'ERR_NF',
        status: 404,
      })
    }

    return res.json(estudiante)
  } catch (err) {
    next(err)
  }
}


export const importarEstudiantes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { colegio } = req.body
    const file = req.file

    // ---------------- VALIDACIÓN INICIAL ----------------
    if (!file || !colegio) {
      throw new ApiError({
        name: 'VALIDATION_ERROR',
        message: 'Archivo Excel y colegio son obligatorios',
        code: 'ERR_VALID',
        status: 400,
      })
    }

    if (!Types.ObjectId.isValid(colegio)) {
      throw new ApiError({
        name: 'VALIDATION_ERROR',
        message: 'ID de colegio inválido',
        code: 'ERR_VALID',
        status: 400,
      })
    }

    // ---------------- LEER EXCEL ----------------
    const workbook = XLSX.read(file.buffer, { type: 'buffer' })
    const sheet = workbook.Sheets[workbook.SheetNames[0]]
    const rows: any[] = XLSX.utils.sheet_to_json(sheet)

    let creados = 0
    let duplicados = 0
    let omitidos = 0

    for (const row of rows) {
      const {
        apellidos,
        nombres,
        password,
        gestion,
        curso,
        nivel,
      } = row

      // nro se ignora (solo referencia visual)

      if (
        !apellidos ||
        !nombres ||
        !password ||
        !gestion ||
        !curso ||
        !nivel
      ) {
        omitidos++
        continue
      }

      const existe = await Estudiante.findOne({
        apellidos: apellidos.toUpperCase(),
        nombres: nombres.toUpperCase(),
        colegio,
        gestion,
      })

      if (existe) {
        duplicados++
        continue
      }

      const hash = await bcrypt.hash(password.toString(), 10)

      await Estudiante.create({
        colegio,
        apellidos,
        nombres,
        password: hash,
        gestion,
        curso,
        nivel,
        estado: 'ACTIVO',
      })

      creados++
    }

    return res.json({
      message: 'Importación completada',
      total: rows.length,
      creados,
      duplicados,
      omitidos,
    })
  } catch (err) {
    next(err)
  }
}
