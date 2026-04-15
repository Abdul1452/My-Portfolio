/**
 * common.types.ts — Shared TypeScript Types
 *
 * WHAT ARE TYPES IN TYPESCRIPT?
 *   Types are "contracts" that describe the shape of data.
 *   TypeScript checks these at compile time (before you run the code),
 *   so you catch mistakes like "I passed a string where a number was expected"
 *   before they cause runtime bugs.
 *
 * WHAT ARE GENERICS (<T>)?
 *   Generics are "type variables" — placeholders for a type that gets
 *   filled in when you USE the type.
 *
 *   Example:
 *     ApiResponse<Project>   → data is a Project
 *     ApiResponse<Project[]> → data is an array of Projects
 *     ApiResponse<null>      → data is null (e.g. on delete)
 *
 *   Without generics, you'd need a separate type for every possible response:
 *     ProjectApiResponse, SkillApiResponse, ContactApiResponse...
 *   With generics: one type, works for everything.
 *
 * USAGE:
 *   import type { ApiResponse, PaginationParams } from '@types/common.types'
 */

// ─── API Response Wrapper ────────────────────────────────────────────────────
//
// Every successful API response from our backend follows this shape.
// The `data` field holds the actual payload; `message` is optional.
//
// Example JSON your API returns:
// {
//   "data": [{ "id": "1", "title": "DevConnect Hub" }],
//   "message": "Projects fetched successfully"
// }

export interface ApiResponse<T> {
  data: T
  message?: string
}

// ─── API Error ───────────────────────────────────────────────────────────────
//
// Every failed API response follows this shape.
// `issues` is only present for validation errors (Zod failures).
//
// Example JSON for a 422 Validation Error:
// {
//   "error": "Validation failed",
//   "code": "VALIDATION_ERROR",
//   "issues": [
//     { "field": "email", "message": "Invalid email address" }
//   ]
// }

export interface ApiError {
  error: string           // Human-readable error message
  code: ErrorCode         // Machine-readable error code
  issues?: ValidationIssue[] // Only for validation errors
}

// ─── Error Codes ─────────────────────────────────────────────────────────────
//
// Using a TypeScript `const` enum means:
//   1. You get autocomplete in your editor
//   2. You can't accidentally pass an invalid string like 'TYPO_ERROR'
//   3. Your error codes are documented in one place

export const ErrorCode = {
  BAD_REQUEST: 'BAD_REQUEST',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  RATE_LIMITED: 'RATE_LIMITED',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const

// `as const` makes all values "literal types" (not just string).
// typeof ErrorCode[keyof typeof ErrorCode] extracts the union:
//   'BAD_REQUEST' | 'NOT_FOUND' | 'VALIDATION_ERROR' | ...

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode]

// ─── Validation Issue ─────────────────────────────────────────────────────────

export interface ValidationIssue {
  field: string    // Which field failed: "email", "name", etc.
  message: string  // What went wrong: "Invalid email address"
}

// ─── Pagination ───────────────────────────────────────────────────────────────
//
// Used for query parameters like: GET /projects?page=2&limit=10

export interface PaginationParams {
  page?: number   // Which page (1-indexed), defaults to 1
  limit?: number  // Items per page, defaults to 10
}

// ─── Sort Order ───────────────────────────────────────────────────────────────

export type SortOrder = 'asc' | 'desc'

// ─── Custom API Error class ───────────────────────────────────────────────────
//
// Extending the built-in Error class lets us throw structured errors anywhere
// in the code and catch them in the global error handler middleware.
//
// Usage:
//   throw new AppError('Project not found', 404, ErrorCode.NOT_FOUND)
//
// The error handler middleware catches this and formats it into an ApiError JSON.

export class AppError extends Error {
  public readonly statusCode: number
  public readonly code: ErrorCode
  public readonly isOperational: boolean

  constructor(
    message: string,
    statusCode: number = 500,
    code: ErrorCode = ErrorCode.INTERNAL_ERROR,
    isOperational: boolean = true
    // isOperational: true  = expected error (user's fault: wrong input, not found)
    // isOperational: false = unexpected error (our fault: DB crashed, bug)
  ) {
    super(message)         // Call the parent Error constructor
    this.name = 'AppError' // Override the error name for logging
    this.statusCode = statusCode
    this.code = code
    this.isOperational = isOperational

    // Maintains proper stack trace in Node.js (V8 engine specific)
    Error.captureStackTrace(this, this.constructor)
  }
}