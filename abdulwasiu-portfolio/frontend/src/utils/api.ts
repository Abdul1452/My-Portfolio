/**
 * api.ts — Typed Fetch Wrapper
 *
 * WHAT THIS FILE DOES:
 *   Wraps the browser's fetch() with:
 *     1. The base URL from env (so you write '/projects' not the full URL)
 *     2. Automatic JSON parsing
 *     3. Consistent error handling (throws a typed ApiError on failure)
 *     4. TypeScript generics so the caller gets correctly-typed data
 *
 * WHY WRAP fetch()?
 *   Raw fetch has two annoying quirks:
 *     - It does NOT throw on HTTP errors (404, 500). You must check res.ok.
 *     - You must manually call res.json() every time.
 *   This wrapper handles both, so every API call is one clean line:
 *     const projects = await fetchApi<Project[]>('/projects')
 *
 * THE GENERIC <T>:
 *   fetchApi<Project[]>('/projects') tells TypeScript "the data field
 *   will be Project[]". You get full autocomplete on the result.
 */

import { ApiError } from '@types/api.types'
import type { ApiResponse, ApiErrorResponse } from '@types/api.types'

// Read the base URL from Vite env vars (defined in .env.local).
// import.meta.env is how Vite exposes environment variables to the browser.
// Only vars prefixed with VITE_ are exposed (security: keeps secrets server-side).
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000/api/v1'

/**
 * fetchApi — the core typed fetch function
 *
 * @template T - the expected type of the `data` field in the response
 * @param endpoint - path relative to the base URL, e.g. '/projects'
 * @param options - standard fetch options (method, body, headers)
 * @returns the `data` field from the response, typed as T
 * @throws ApiError if the request fails or returns a non-2xx status
 */
export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // Build the full URL
  const url = `${API_BASE_URL}${endpoint}`

  // Set default headers, merge with any caller-provided ones
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  let response: Response
  try {
    response = await fetch(url, { ...options, headers })
  } catch (networkError) {
    // fetch() only throws on NETWORK failures (server unreachable, no internet).
    // We translate this into our ApiError for consistent handling.
    throw new ApiError(
      'Network error — could not reach the server. Please check your connection.',
      0,                    // status 0 = no HTTP response received
      'NETWORK_ERROR'
    )
  }

  // Parse the JSON body. We do this for both success and error responses
  // because our API always returns JSON.
  let body: unknown
  try {
    body = await response.json()
  } catch {
    // Response wasn't valid JSON (shouldn't happen with our API, but be safe)
    throw new ApiError(
      'Received an invalid response from the server.',
      response.status,
      'INVALID_RESPONSE'
    )
  }

  // fetch does NOT throw on 4xx/5xx — we check manually.
  if (!response.ok) {
    // The body should match our ApiErrorResponse shape
    const errorBody = body as ApiErrorResponse
    throw new ApiError(
      errorBody.error ?? 'An unexpected error occurred',
      response.status,
      errorBody.code ?? 'INTERNAL_ERROR',
      errorBody.issues
    )
  }

  // Success — unwrap the { data } envelope and return just the data, typed as T
  const successBody = body as ApiResponse<T>
  return successBody.data
}

// ─── Convenience methods ────────────────────────────────────────────────────
//
// Small shortcuts so callers can write api.get('/projects') instead of
// spelling out the method every time.

export const api = {
  get: <T>(endpoint: string) =>
    fetchApi<T>(endpoint, { method: 'GET' }),

  post: <T>(endpoint: string, data: unknown) =>
    fetchApi<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
}
