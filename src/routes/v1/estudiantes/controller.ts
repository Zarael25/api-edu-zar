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
      carnet,
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
      !carnet ||
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
      carnet: carnet.toUpperCase(),
      colegio,
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
      carnet,
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
   - Filtros opcionales:
     ?colegio=ID
     ?nivel=SM
     ?curso=2A
====================================================== */
export const getEstudiantes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { colegio, nivel, curso } = req.query

    const filter: any = {
      estado: 'ACTIVO',
    }

    // ---------------- VALIDAR COLEGIO ----------------
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

    // ---------------- FILTRO NIVEL ----------------
    if (nivel) {
      filter.nivel = nivel
    }

    // ---------------- FILTRO CURSO ----------------
    if (curso) {
      filter.curso = curso
    }

    const estudiantes = await Estudiante.find(filter)
      .populate('colegio', 'nombre_colegio sigla')
      .sort({ apellidos: 1, nombres: 1 })
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

    // ---------------- OBTENER COLEGIO ----------------
    const colegioDB = await Colegio.findById(colegio).lean()
    if (!colegioDB) {
      throw new ApiError({
        name: 'NOT_FOUND_ERROR',
        message: 'Colegio no encontrado',
        code: 'ERR_NF',
        status: 404,
      })
    }

    const siglaColegio = colegioDB.sigla?.toUpperCase()

    // ---------------- LEER EXCEL ----------------
    const workbook = XLSX.read(file.buffer, { type: 'buffer' })
    const sheet = workbook.Sheets[workbook.SheetNames[0]]

    // 👉 SIGLA VIENE DE B1
    const siglaExcel = sheet['B1']?.v?.toString().trim().toUpperCase()

    if (!siglaExcel || siglaExcel !== siglaColegio) {
      throw new ApiError({
        name: 'VALIDATION_ERROR',
        message:
          'La sigla del Excel no coincide con el colegio seleccionado',
        code: 'ERR_SIGLA',
        status: 400,
      })
    }

    // 👉 HEADERS ESTÁN EN LA FILA 2
    const rows: any[] = XLSX.utils.sheet_to_json(sheet, {
      range: 1, // ignora fila 1
    })

    let creados = 0
    let duplicados = 0
    let omitidos = 0

    for (const row of rows) {
      const {
        apellidos,
        nombres,
        carnet,
        gestion,
        curso,
        nivel,
      } = row

      // ---------------- VALIDACIÓN DE FILA ----------------
      if (
        !apellidos ||
        !nombres ||
        !carnet ||
        !gestion ||
        !curso ||
        !nivel
      ) {
        omitidos++
        continue
      }

      const carnetNormalizado = carnet.toString().trim().toUpperCase()

      // ---------------- EVITAR DUPLICADOS ----------------
      const existe = await Estudiante.findOne({
        carnet: carnetNormalizado,
        colegio,
      })

      if (existe) {
        duplicados++
        continue
      }

      // ---------------- PASSWORD = CARNET ----------------
      const passwordHash = await bcrypt.hash(carnetNormalizado, 10)

      // ---------------- CREAR ESTUDIANTE ----------------
      await Estudiante.create({
        colegio,
        carnet: carnetNormalizado,
        apellidos,
        nombres,
        password: passwordHash,
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


/* ======================================================
   OBTENER CURSOS EXISTENTES POR COLEGIO Y NIVEL
   GET /v1/estudiantes/cursos
====================================================== */
export const getCursosByColegio = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { colegio, nivel } = req.query

    // Validar colegio
    if (!colegio || !Types.ObjectId.isValid(colegio as string)) {
      throw new ApiError({
        name: 'VALIDATION_ERROR',
        message: 'ID de colegio inválido',
        code: 'ERR_VALID',
        status: 400,
      })
    }

    const filter: any = {
      colegio,
      estado: 'ACTIVO',
    }

    if (nivel) {
      filter.nivel = nivel
    }

    const cursos = await Estudiante.distinct('curso', filter)

    return res.json({
      count: cursos.length,
      data: cursos.sort(),
    })
  } catch (err) {
    next(err)
  }
}
