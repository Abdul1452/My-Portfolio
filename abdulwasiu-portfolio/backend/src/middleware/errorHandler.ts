/**
 * errorHandler.ts — Global Express Error Handler Middleware
 *
 * HOW EXPRESS ERROR HANDLING WORKS:
 *   In Express, a middleware with FOUR parameters (err, req, res, next)
 *   is treated as an "error handling middleware". It only runs when
 *   next(err) is called with an error — either from:
 *     1. asyncHandler catching a thrown error
 *     2. A middleware calling next(new Error(...))
 *     3. Express itself (e.g., JSON parse error)
 *
 *   IMPORTANT: This must be registered LAST in app.ts, after all routes.
 *   Express processes middleware in order; if no route handles the request,
 *   it falls through to this handler.
 *
 * WHAT THIS HANDLES:
 *   - AppError (our custom errors): use their statusCode and message
 *   - ZodError (validation failures): format into our ApiError shape
 *   - Prisma errors: translate DB errors to user-friendly messages
 *   - Unknown errors: return generic 500 without leaking internals
 */

import type { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'
import { Prisma } from '@prisma/client'
import { AppError, ErrorCode } from '@types/index'
import { logger } from '@config/logger'
import { sendError } from '@utils/response'

// The `_next` parameter is required by Express to identify this as an
// error handler (4 params), even if we don't use it.
// The underscore prefix tells ESLint/TypeScript we're intentionally not using it.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction): void {
  // ── 1. Our custom AppError ──────────────────────────────────────────────────
  if (err instanceof AppError) {
    // Log operational errors at 'warn' level (expected), others at 'error'
    if (err.isOperational) {
      logger.warn(`[AppError] ${err.message}`, {
        code: err.code,
        path: req.path,
        method: req.method,
      })
    } else {
      logger.error(`[AppError] Unexpected: ${err.message}`, {
        stack: err.stack,
        path: req.path,
      })
    }

    sendError(res, err.message, err.statusCode, err.code)
    return
  }

  // ── 2. Zod validation error ─────────────────────────────────────────────────
  if (err instanceof ZodError) {
    logger.warn('[ZodError] Validation failed', { issues: err.issues, path: req.path })

    // Transform Zod's issues into our simpler ValidationIssue shape
    const issues = err.issues.map(issue => ({
      field: issue.path.join('.'), // ['name'] → 'name', ['address', 'city'] → 'address.city'
      message: issue.message,
    }))

    sendError(res, 'Validation failed', 422, ErrorCode.VALIDATION_ERROR, issues)
    return
  }

  // ── 3. Prisma database errors ────────────────────────────────────────────────
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    logger.error('[PrismaError]', { code: err.code, meta: err.meta })

    // P2002 = Unique constraint violation (e.g., duplicate email)
    if (err.code === 'P2002') {
      sendError(res, 'A record with this value already exists', 409, ErrorCode.BAD_REQUEST)
      return
    }

    // P2025 = Record not found
    if (err.code === 'P2025') {
      sendError(res, 'Record not found', 404, ErrorCode.NOT_FOUND)
      return
    }
  }

  // ── 4. Express JSON body parse error ─────────────────────────────────────────
  if (err instanceof SyntaxError && 'body' in err) {
    sendError(res, 'Invalid JSON in request body', 400, ErrorCode.BAD_REQUEST)
    return
  }

  // ── 5. Unknown / unexpected errors ───────────────────────────────────────────
  // NEVER expose internal error details to the client — security risk.
  // Log everything, return generic message.
  logger.error('[UnhandledError]', {
    error: err instanceof Error ? err.message : String(err),
    stack: err instanceof Error ? err.stack : undefined,
    path: req.path,
    method: req.method,
  })

  sendError(
    res,
    'An unexpected error occurred. Please try again later.',
    500,
    ErrorCode.INTERNAL_ERROR
  )
}
