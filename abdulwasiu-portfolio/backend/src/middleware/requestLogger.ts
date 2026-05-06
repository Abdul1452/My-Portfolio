/**
 * requestLogger.ts — HTTP Request Logging Middleware
 *
 * WHY LOG HTTP REQUESTS?
 *   Every request that hits your server is logged: method, path, status code,
 *   response time. This is invaluable for:
 *     - Debugging: "why did this request fail?"
 *     - Monitoring: "how long do requests take?"
 *     - Security: "who is hitting which endpoints?"
 *
 * MORGAN:
 *   Morgan is a small Express middleware that intercepts requests and responses,
 *   formats them into a log string, and writes to a stream.
 *   We point it at our Winston stream so all logs go to the same place.
 */

import morgan from 'morgan'
import { morganStream } from '@config/logger'
import { env } from '@config/env'

// Morgan format tokens:
//   :method     → GET, POST, etc.
//   :url        → /api/v1/projects
//   :status     → 200, 404, 500
//   :res[...]   → response header value
//   :response-time → milliseconds to respond
//   :remote-addr → client IP address

const developmentFormat =
  ':method :url :status :response-time ms'

const productionFormat =
  ':remote-addr :method :url :status :res[content-length] - :response-time ms'

export const requestLogger = morgan(
  env.NODE_ENV === 'development' ? developmentFormat : productionFormat,
  { stream: morganStream }
)
