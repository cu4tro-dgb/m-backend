import { NextFunction, Request, Response } from 'express'
import { ZodError, ZodTypeAny } from 'zod'

export default function validateSchema<T extends ZodTypeAny>(schema: T) {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      const result = await schema.parseAsync(req.body)
      req.body = result
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        const errorFormat = error.errors.map(({ path, message }) => ({
          path,
          message
        }))

        res.status(400).json({ errors: errorFormat })
        return
      }
      next(error)
    }
  }
}
