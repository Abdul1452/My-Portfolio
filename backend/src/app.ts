/**
 * app.ts — Express Application Setup
 *
 * WHAT THIS FILE DOES:
 *   Creates and configures the Express application object.
 *   Registers all middleware in the correct order.
 *   Does NOT start the server (that's server.ts).
 *
 * WHY SEPARATE app.ts FROM server.ts?
 *   Clean separation of concerns:
 *   - app.ts   → defines WHAT the server does (routes, middleware)
 *   - server.ts → defines HOW it starts (port, DB connection)
 *
 *   This also makes testing much easier: you can import the `app`
 *   in test files and call endpoints without actually starting
 *   a real HTTP server on a port.
 *
 * MIDDLEWARE ORDER MATTERS:
 *   Express processes middleware top-to-bottom.
 *   Security headers (helmet) must come first.
 *   CORS must come before routes (so preflight OPTIONS requests are handled).
 *   Body parser must come before routes (so req.body is populated).
 *   Error handler must come LAST (catches errors thrown by anything above).
 */

import express, { type Request, type Response, type NextFunction } from 'express'
import helmet     from 'helmet'
import cors       from 'cors'

import { corsOptions }    from '@config/cors'
import { env }            from '@config/env'
import { logger }         from '@config/logger'
import { requestLogger }  from '@middleware/requestLogger'
import { globalLimiter }  from '@middleware/rateLimit'
import { errorHandler }   from '@middleware/errorHandler'
import { AppError, ErrorCode } from '@app-types'
import apiRouter          from '@routes/index'

// ─── Create the Express app ───────────────────────────────────────────────────

const app = express()

// ─── 1. Security headers (FIRST — before anything else) ──────────────────────
//
// helmet() sets a suite of HTTP response headers that protect against
// common web vulnerabilities:
//   - X-Frame-Options: DENY          → prevents clickjacking
//   - X-XSS-Protection              → hints to browser XSS filter
//   - X-Content-Type-Options: nosniff → stops MIME type sniffing
//   - Strict-Transport-Security     → forces HTTPS
//   - Content-Security-Policy       → restricts resource loading
//
// It's a single line that gives you a lot of free security hardening.

app.use(helmet({
  // Relax CSP for development (Vite's dev server needs some loosening)
  contentSecurityPolicy: env.NODE_ENV === 'production',
}))

// ─── 2. CORS ──────────────────────────────────────────────────────────────────
//
// Must come before routes so that:
//   a) Preflight OPTIONS requests get a response before hitting routes
//   b) CORS headers are set on ALL responses, including error responses

app.use(cors(corsOptions))

// ─── 3. Body Parsers ──────────────────────────────────────────────────────────
//
// express.json() reads the raw request body and parses it as JSON,
// attaching the result to req.body.
//
// Without this, req.body is undefined — your controllers get nothing.
//
// The limit option prevents very large payloads (DoS protection):
//   '50kb' means requests larger than 50 kilobytes are rejected.

app.use(express.json({ limit: '50kb' }))

// express.urlencoded() parses HTML form submissions
// (Content-Type: application/x-www-form-urlencoded)
// extended: false means use the built-in querystring library (simpler, sufficient)
app.use(express.urlencoded({ extended: false, limit: '50kb' }))

// ─── 4. Request logging ───────────────────────────────────────────────────────
//
// Logs every request: "GET /api/v1/projects 200 12ms"
// Must come after body parser so the content-length is known.

app.use(requestLogger)

// ─── 5. Global rate limiter ───────────────────────────────────────────────────
//
// Applies to ALL routes: max 100 requests per 15 minutes per IP.
// The stricter contactLimiter is applied only to POST /contact in its own router.

app.use(globalLimiter)

// ─── 6. API Routes ────────────────────────────────────────────────────────────
//
// Mount the entire API router under /api/v1.
// All routes defined in routes/index.ts are prefixed with /api/v1.
//
// Example: healthRoutes is mounted at /health inside routes/index.ts
//          → final URL: GET /api/v1/health

app.use(env.API_PREFIX, apiRouter)

// ─── 7. 404 handler ───────────────────────────────────────────────────────────
//
// If NO route above matched the incoming URL, Express falls through to here.
// We throw an AppError so the global errorHandler formats it consistently.
//
// Without this, Express would return a plain HTML "Cannot GET /xyz" page
// instead of our standard JSON error format.

app.use((req: Request, _res: Response, next: NextFunction) => {
  logger.warn(`404 — Route not found: ${req.method} ${req.originalUrl}`)
  next(new AppError(
    `Route ${req.method} ${req.originalUrl} not found`,
    404,
    ErrorCode.NOT_FOUND
  ))
})

// ─── 8. Global error handler (LAST — always) ─────────────────────────────────
//
// Must be registered AFTER all routes and other middleware.
// Express identifies this as an error handler because it has 4 parameters.
// Any call to next(err) anywhere in the app lands here.

app.use(errorHandler)

export default app
