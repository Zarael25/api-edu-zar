import { NextFunction, Request, Response } from 'express'
import { ObjectSchema } from 'joi'

export default function validateRequest(schema: ObjectSchema) {
  return async function validator(
    req: Request,
    _res: Response,
    next: NextFunction,
  ) {
    if (!req.body) {
      return next()
    }

    try {
      await schema.validateAsync(req.body, { abortEarly: false })
      return next()
    } catch (error) {
      return next(error)
    }
  }
}
