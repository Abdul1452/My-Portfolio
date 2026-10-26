/**
 * validateRequest.ts - Zod request body validation middleware factory.
 */

import type { Request, Response, NextFunction } from 'express'
import type { ZodSchema } from 'zod'

export function validateRequest(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body)

    if (!result.success) {
      next(result.error)
      return
    }

    req.validatedBody = result.data
    next()
  }
}
