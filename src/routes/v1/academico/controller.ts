import { Request, Response } from 'express'
import Materia from '../../../database/models/materia'

export const estructuraAcademica = async (
  req: Request,
  res: Response
) => {
  const usuario = req.user as any

  const filtro: any = { estado: 'ACTIVO' }

  if (usuario.roles.includes('profesor')) {
    filtro.profesor = usuario.id
  }

  const materias = await Materia.find(filtro)
    .populate('colegio', 'nombre_colegio sigla')
    .lean()

  const estructura: any = {}

  for (const m of materias) {
    const colegioId = m.colegio._id.toString()

    if (!estructura[colegioId]) {
      estructura[colegioId] = {
        colegio: m.colegio,
        niveles: {},
      }
    }

    if (!estructura[colegioId].niveles[m.nivel]) {
      estructura[colegioId].niveles[m.nivel] = new Set()
    }

    estructura[colegioId].niveles[m.nivel].add(m.curso)
  }

  const resultado = Object.values(estructura).map((item: any) => ({
    colegio: item.colegio,
    niveles: Object.entries(item.niveles).map(
      ([nivel, cursos]: any) => ({
        nivel,
        cursos: Array.from(cursos),
      })
    ),
  }))

  res.json(resultado)
}
