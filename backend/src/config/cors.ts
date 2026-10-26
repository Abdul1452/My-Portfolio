// Cross Origin resource Sharing
/**
 * cors.ts — CORS Configuration
 *
 * WHAT IS CORS?
 *   CORS = Cross-Origin Resource Sharing.
 *   A browser security feature that BLOCKS requests from one "origin"
 *   (domain + port) to a different origin — UNLESS the server explicitly
 *   allows it.
 *
 *   Your frontend runs on: http://localhost:5173  (origin A)
 *   Your backend  runs on: http://localhost:4000  (origin B)
 *
 *   Without CORS config, every fetch() from your React app to the API
 *   will be blocked by the browser with a red "CORS error" in the console.
 *
 * HOW IT WORKS:
 *   When the browser sees a cross-origin request, it first sends a "preflight"
 *   OPTIONS request asking: "Are you ok with requests from my origin?"
 *   The server responds with headers like:
 *     Access-Control-Allow-Origin: http://localhost:5173
 *     Access-Control-Allow-Methods: GET, POST, ...
 *   The browser reads these headers and decides whether to allow the real request.
 *
 * NOTE: CORS is a BROWSER protection only. Postman, curl, and your backend
 *   calling another backend are NOT affected by CORS.
 *
 * USAGE:
 *   import { corsOptions } from '@config/cors'
 *   app.use(cors(corsOptions))
 */

import type { CorsOptions } from 'cors'
import { env } from './env'
import { logger } from './logger'

// ─── Parse allowed origins from env ─────────────────────────────────────────
//
// In .env: CORS_ORIGINS=http://localhost:5173,https://abdulwasiu.dev
// We split on comma to get an array of allowed origins.

const allowedOrigins = env.CORS_ORIGINS.split(',')
  .map(origin => origin.trim()) // remove any accidental spaces
  .filter(Boolean) // remove empty strings

logger.debug(`CORS allowed origins: ${allowedOrigins.join(', ')}`)

// ─── CORS options ────────────────────────────────────────────────────────────

export const corsOptions: CorsOptions = {
  // origin can be:
  //   - a string: 'http://localhost:5173'       → only that origin
  //   - true: allow ANY origin (dangerous in production!)
  //   - a function: called for every request, returns true/false
  //
  // We use a function so we can check against our dynamic list of allowed origins.
  origin(requestOrigin: string | undefined, callback: (err: Error | null, allow?: boolean) => void): void {
    // requestOrigin is undefined for:
    //   - Same-origin requests (browser → same server)
    //   - Server-to-server requests (curl, Postman, backend calls)
    // We allow these without restriction.
    if (!requestOrigin) {
      callback(null, true)
      return
    }

    if (allowedOrigins.includes(requestOrigin)) {
      // Origin is in our allowed list → allow it
      callback(null, true)
    } else {
      // Origin is NOT allowed → reject with an error
      logger.warn(`CORS blocked request from origin: ${requestOrigin}`)
      callback(new Error(`Origin ${requestOrigin} not allowed by CORS policy`))
    }
  },

  // Which HTTP methods are allowed
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],

  // Which headers the client is allowed to send
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],

  // Allow the browser to send cookies / auth headers with requests
  credentials: true,

  // How long (seconds) the browser should cache the preflight response.
  // 86400 = 24 hours. Reduces preflight requests.
  maxAge: 86400,
}
