/**
 * api.ts — API Versioning Constants
 *
 * WHAT THIS FILE DOES:
 *   Declares the base path every API version lives under, and the list of
 *   versions this server currently supports. Everything else (route mounting,
 *   the GET /api discovery endpoint, the "unsupported version" error) reads
 *   from here, so adding a version starts with one line in this file.
 *
 * URL SHAPE:
 *   /api/v1/projects
 *   └┬─┘ └┬┘ └──┬───┘
 *    │    │     └─ resource (defined in routes/v1/*.routes.ts)
 *    │    └─────── version  (one of API_VERSIONS)
 *    └──────────── API_BASE_PATH
 *
 * WHY IN CODE AND NOT .env?
 *   Which routes belong to which version is decided by the code in
 *   routes/v1/, routes/v2/, … — not by the machine the server runs on.
 *   If the version came from .env, a typo in one deployment could silently
 *   serve the wrong URLs. Constants can't drift between environments.
 */

// Every version is mounted under this path: /api/v1, /api/v2, …
export const API_BASE_PATH = '/api'

// All versions currently served, oldest first.
// `as const` turns this into the literal type readonly ['v1'] instead of
// string[], so TypeScript will reject apiVersion('v3') until 'v3' is listed here.
export const API_VERSIONS = ['v1'] as const

// 'v1' (and later 'v1' | 'v2', …) — derived from the list above.
export type ApiVersion = (typeof API_VERSIONS)[number]

// The version new clients should use. Reported by GET /api.
export const LATEST_API_VERSION: ApiVersion = 'v1'

// Type guard: narrows a plain string (e.g. a URL segment) to ApiVersion.
//   isApiVersion('v1')       → true
//   isApiVersion('projects') → false
export function isApiVersion(value: string): value is ApiVersion {
  return (API_VERSIONS as readonly string[]).includes(value)
}
