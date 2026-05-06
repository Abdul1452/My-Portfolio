/**
 * validateRequest.ts — Zod Request Body Validation Middleware Factory
 *
 * HOW IT WORKS:
 *   validateRequest(schema) returns an Express middleware function.
 *   This pattern is called a "middleware factory" — a function that returns
 *   a middleware, configured by the arguments you pass.
 *
 *   Usage in routes:
 *     router.post('/', validateRequest(contactSchema), contactController.submit)
 *
 *   Flow:
 *     1. Client sends POST /contact with { name, email, subject, message }
 *     2. Express parses req.body (JSON)
 *     3. Our middleware runs: schema.safeParse(req.body)
 *     4a. If valid: attach parsed data to req.validatedBody, call next()
 *     4b. If invalid: call next(ZodError) → errorHandler formats & returns 422
 */

import type { Request, Response, NextFunction } from 'express'
import type { ZodSchema } from 'zod'

export function validateRequest(schema: ZodSchema) {
  // Return the actual middleware function
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body)

    if (!result.success) {
      // Pass the ZodError to the next error handler
      next(result.error)
      return
    }

    // Attach validated (and typed) data to the request for the controller
    req.validatedBody = result.data
    next()
  }
}
/**
 * validateRequest.ts — Zod Request Body Validation Middleware Factory
 *
 * HOW IT WORKS:
 *   validateRequest(schema) returns an Express middleware function.
 *   This pattern is called a "middleware factory" — a function that returns
 *   a middleware, configured by the arguments you pass.
 *
 *   Usage in routes:
 *     router.post('/', validateRequest(contactSchema), contactController.submit)
 *
 *   Flow:
 *     1. Client sends POST /contact with { name, email, subject, message }
 *     2. Express parses req.body (JSON)
 *     3. Our middleware runs: schema.safeParse(req.body)
 *     4a. If valid: attach parsed data to req.validatedBody, call next()
 *     4b. If invalid: call next(ZodError) → errorHandler formats & returns 422
 */

import type { Request, Response, NextFunction } from 'express'
import type { ZodSchema } from 'zod'

export function validateRequest(schema: ZodSchema) {
  // Return the actual middleware function
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body)

    if (!result.success) {
      // Pass the ZodError to the next error handler
      next(result.error)
      return
    }

    // Attach validated (and typed) data to the request for the controller
    req.validatedBody = result.data
    next()
  }
}
