import { Request, Response, NextFunction } from 'express'
import { Types } from 'mongoose'

import Colegio from '../../../database/models/Colegio'
import ApiError from '../../../errors/ApiError'

// ===============================
// CREAR COLEGIO /v1/colegios (POST)
// ===============================
// - Requiere autenticación JWT
// - Crea un nuevo colegio
// - Asocia automáticamente al usuario autenticado
// ===============================
export const crearColegio = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // ===============================
    // Usuario autenticado
    // (inyectado por passport-jwt)
    // ===============================
    const user = req.user

    // Si no existe usuario, no está autenticado
    if (!user) {
      throw new ApiError({
        name: 'UNAUTHORIZED_ERROR',
        message: 'No autorizado',
        code: 'ERR_UNAUTH',
        status: 401,
      })
    }

    // ===============================
    // Datos enviados desde el frontend
    // ===============================
    const { nombre_colegio, niveles } = req.body

    // Validación básica de campos obligatorios
    if (!nombre_colegio || !niveles?.length) {
      throw new ApiError({
        name: 'VALIDATION_ERROR',
        message: 'Datos incompletos',
        code: 'ERR_VALID',
        status: 400,
      })
    }

    // ===============================
    // Verificar si ya existe un colegio
    // con el mismo nombre
    // ===============================
    const existe = await Colegio.findOne({
      nombre_colegio: nombre_colegio.toUpperCase(),
    })

    if (existe) {
      throw new ApiError({
        name: 'CONFLICT_ERROR',
        message: 'Ya existe un colegio con ese nombre',
        code: 'ERR_CONFLICT',
        status: 409,
      })
    }

    // ===============================
    // Convertir ID del usuario a ObjectId
    // (JWT → string → ObjectId)
    // ===============================
    const userId = new Types.ObjectId(user.id)

    // ===============================
    // Crear el colegio
    // - El usuario autenticado queda
    //   automáticamente asociado
    // ===============================
    const colegio = await Colegio.create({
      usuarios: [userId],        // usuario creador
      nombre_colegio,
      niveles,
      estado: 'ACTIVO',
    })

    // ===============================
    // Respuesta exitosa
    // ===============================
    return res.status(201).json(colegio)
  } catch (err) {
    // Delegar manejo de errores al errorHandler
    next(err)
  }
}


// ===============================
// LISTAR COLEGIOS DEL USUARIO
// GET /v1/colegios
// ===============================
export const getMisColegios = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user

    if (!user) {
      throw new ApiError({
        name: 'UNAUTHORIZED_ERROR',
        message: 'No autorizado',
        code: 'ERR_UNAUTH',
        status: 401,
      })
    }

    const userId = new Types.ObjectId(user.id)

    const colegios = await Colegio.find({
      usuarios: userId,
      estado: 'ACTIVO',
    }).lean()

    return res.json({
      count: colegios.length,
      data: colegios,
    })
  } catch (err) {
    next(err)
  }
}


// ===============================
// OBTENER COLEGIO POR ID
// GET /v1/colegios/:id
// ===============================
export const getColegioById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user

    if (!user) {
      throw new ApiError({
        name: 'UNAUTHORIZED_ERROR',
        message: 'No autorizado',
        code: 'ERR_UNAUTH',
        status: 401,
      })
    }

    const { id } = req.params

    // Validar ObjectId
    if (!Types.ObjectId.isValid(id)) {
      throw new ApiError({
        name: 'VALIDATION_ERROR',
        message: 'ID de colegio inválido',
        code: 'ERR_VALID',
        status: 400,
      })
    }

    const userId = new Types.ObjectId(user.id)

    // Buscar colegio SOLO si el usuario pertenece
    const colegio = await Colegio.findOne({
      _id: id,
      usuarios: userId,
      estado: 'ACTIVO',
    }).lean()

    if (!colegio) {
      throw new ApiError({
        name: 'NOT_FOUND_ERROR',
        message: 'Colegio no encontrado o sin acceso',
        code: 'ERR_NF',
        status: 404,
      })
    }

    return res.json(colegio)
  } catch (err) {
    next(err)
  }
}



// ===============================
// EDITAR COLEGIO
// PATCH /v1/colegios/:id
// ===============================
export const editarColegio = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user

    if (!user) {
      throw new ApiError({
        name: 'UNAUTHORIZED_ERROR',
        message: 'No autorizado',
        code: 'ERR_UNAUTH',
        status: 401,
      })
    }

    const { id } = req.params
    const { nombre_colegio, niveles } = req.body

    // ===============================
    // Validar ID
    // ===============================
    if (!Types.ObjectId.isValid(id)) {
      throw new ApiError({
        name: 'VALIDATION_ERROR',
        message: 'ID de colegio inválido',
        code: 'ERR_VALID',
        status: 400,
      })
    }

    // ===============================
    // Al menos un campo a actualizar
    // ===============================
    if (!nombre_colegio && !niveles) {
      throw new ApiError({
        name: 'VALIDATION_ERROR',
        message: 'No hay datos para actualizar',
        code: 'ERR_VALID',
        status: 400,
      })
    }

    const userId = new Types.ObjectId(user.id)

    // ===============================
    // Verificar acceso al colegio
    // ===============================
    const colegio = await Colegio.findOne({
      _id: id,
      usuarios: userId,
      estado: 'ACTIVO',
    })

    if (!colegio) {
      throw new ApiError({
        name: 'NOT_FOUND_ERROR',
        message: 'Colegio no encontrado o sin acceso',
        code: 'ERR_NF',
        status: 404,
      })
    }

    // ===============================
    // Validar nombre duplicado (si cambia)
    // ===============================
    if (nombre_colegio) {
      const existe = await Colegio.findOne({
        _id: { $ne: id },
        nombre_colegio: nombre_colegio.toUpperCase(),
      })

      if (existe) {
        throw new ApiError({
          name: 'CONFLICT_ERROR',
          message: 'Ya existe un colegio con ese nombre',
          code: 'ERR_CONFLICT',
          status: 409,
        })
      }

      colegio.nombre_colegio = nombre_colegio
    }

    // ===============================
    // Actualizar niveles
    // ===============================
    if (niveles) {
      colegio.niveles = niveles
    }

    await colegio.save()

    return res.json({
      message: 'Colegio actualizado correctamente',
      data: colegio,
    })
  } catch (err) {
    next(err)
  }
}
