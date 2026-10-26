/**
 * api.types.ts — API Response Types (Frontend)
 *
 * These mirror the backend's response envelope (backend/src/types/common.types).
 * EVERY response from our API is wrapped in one of these shapes.
 *
 * Successful response:  { data: T, message?: string }
 * Error response:       { error: string, code: string, issues?: [...] }
 *
 * Typing these lets our fetch wrapper (utils/api.ts) return correctly-typed
 * data and lets us handle errors in a consistent, type-safe way.
 */

// Successful API response envelope. T is the payload type.
// Example: ApiResponse<Project[]> → { data: Project[], message?: string }
export interface ApiResponse<T> {
  data: T
  message?: string
}

// A single validation issue (from Zod on the backend)
export interface ValidationIssue {
  field: string    // "email"
  message: string  // "Please enter a valid email address"
}

// Error API response envelope
export interface ApiErrorResponse {
  error: string
  code: string
  issues?: ValidationIssue[]  // Only present on 422 validation errors
}

// The error codes the backend can return.
// Mirrors the backend ErrorCode enum.
export type ApiErrorCode =
  | 'BAD_REQUEST'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'RATE_LIMITED'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'INTERNAL_ERROR'

// A custom Error subclass our fetch wrapper throws on failed requests.
// Carries the HTTP status and structured error info so components can
// react appropriately (e.g., show validation errors on the form).
export class ApiError extends Error {
  public readonly status: number
  public readonly code: string
  public readonly issues?: ValidationIssue[]

  constructor(message: string, status: number, code: string, issues?: ValidationIssue[]) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.issues = issues
  }
}
