/**
 * response.ts — Standardised API Response Helpers
 *
 * WHY HELPERS?
 *   Without helpers, every controller would write its own JSON structure:
 *     res.status(200).json({ data: projects })
 *     res.status(200).json({ data: skills, message: 'ok' })
 *     res.status(404).json({ error: 'Not found' })
 *
 *   If you later decide to add a `timestamp` field to every response,
 *   you'd have to update 30+ files.
 *
 *   With helpers, you change ONE function and every response updates.
 *   Also: your controllers are cleaner and more readable.
 *
 * USAGE:
 *   sendSuccess(res, projects)              → 200 { data: projects }
 *   sendSuccess(res, project, 201)          → 201 { data: project }
 *   sendError(res, 'Not found', 404)        → 404 { error: 'Not found', code: 'NOT_FOUND' }
 */

import type { Response } from 'express'
import type { ApiResponse, ApiError } from '@types/common.types'
import { ErrorCode } from '@types/common.types'

// ─── Success response ─────────────────────────────────────────────────────────

export function sendSuccess<T>(
  res: Response,
  data: T,
  statusCode: number = 200,
  message?: string
): Response {
  const body: ApiResponse<T> = { data }
  if (message) body.message = message

  return res.status(statusCode).json(body)
}

// ─── Error response ───────────────────────────────────────────────────────────

export function sendError(
  res: Response,
  message: string,
  statusCode: number = 500,
  code: ErrorCode = ErrorCode.INTERNAL_ERROR,
  issues?: ApiError['issues']
): Response {
  const body: ApiError = { error: message, code }
  if (issues) body.issues = issues

  return res.status(statusCode).json(body)
}

// ─── Convenience shortcuts ────────────────────────────────────────────────────

export const sendNotFound = (res: Response, resource = 'Resource') =>
  sendError(res, `${resource} not found`, 404, ErrorCode.NOT_FOUND)

export const sendBadRequest = (res: Response, message: string) =>
  sendError(res, message, 400, ErrorCode.BAD_REQUEST)

export const sendUnauthorized = (res: Response) =>
  sendError(res, 'Authentication required', 401, ErrorCode.UNAUTHORIZED)
